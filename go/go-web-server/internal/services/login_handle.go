package services

import (
	constants "go-server-constants"
	"go-web-server/internal/dao"
	"go-web-server/internal/model"
	"go-web-server/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRes struct {
	Token   string `json:"token" binding:"required"`
	Message string `json:"message" binding:"omitempty"`
}

// 登录用户
func (c *CmsApp) Login(ctx *gin.Context) {
	var req LoginReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "Internal server error",
			},
		})
		return
	}
	// 连接数据库
	userDao := dao.NewUserDao(c.db)
	// 判断用户是否存在
	isExist, err := userDao.IsExist(req.Username)
	if err != nil && err != gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusInternalServerError, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "Internal server error",
			},
		})
		return
	}
	if !isExist {
		ctx.JSON(http.StatusBadRequest, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "user not exist",
			},
		})
		return
	}
	// 处理数据库创建用户逻辑
	user, err := userDao.GetUserByUsername(req.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "Internal server error",
			},
		})
		return
	}
	if err := utils.ComparePassword(user.Password, req.Password); err != nil {
		ctx.JSON(http.StatusBadRequest, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "Username or Password is incorrect",
			},
		})
		return
	}

	// 生成token
	token, err := c.generateToken(ctx, user.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: LoginRes{
				Message: "Internal server error",
			},
		})
	}

	ctx.JSON(http.StatusOK, model.BaseRes{
		Code: constants.StatusOK,
		Msg:  model.MsgOk,
		Data: LoginRes{
			Token:   token,
			Message: "Login successfully",
		},
	})
}
