package services

import (
	"context"
	"fmt"
	"go-web-server/internal/dao"
	"go-web-server/internal/model"
	"go-web-server/internal/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RegisterReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRes struct {
	// Id 		int64 	`json:"id" binding:"required"`
	Message string `json:"message" binding:"required"`
}

// 注册用户
func (c *CmsApp) Register(ctx *gin.Context) {
	var req RegisterReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}
	// 连接数据库
	userDao := dao.NewUserDao(c.db)
	// 判断用户是否存在
	isExist, err := userDao.IsExist(req.Username)
	if err != nil && err != gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusInternalServerError,
			model.BaseRes{
				Code: model.CodeErr,
				Msg:  model.MsgErr,
				Data: RegisterRes{
					Message: "Internal server error",
				},
			})
		return
	}
	if isExist {
		ctx.JSON(http.StatusBadRequest, model.BaseRes{
			Code: model.CodeErr,
			Msg:  model.MsgErr,
			Data: RegisterRes{
				Message: "User already exists",
			},
		})
		return
	}

	// 处理数据库创建用户逻辑

	hashedPassword, err := utils.EncryptPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError,
			model.BaseRes{
				Code: model.CodeErr,
				Msg:  model.MsgErr,
				Data: RegisterRes{
					Message: "Internal server error",
				},
			})
		return
	}

	fmt.Printf("hashedPassword = %v \n", hashedPassword)
	fmt.Println(utils.ComparePassword(hashedPassword, req.Password))

	now := time.Now()
	user := &model.User{
		Username: req.Username,
		Password: hashedPassword,
		Ct:       now,
		Ut:       now,
	}
	if err := userDao.Create(user); err != nil {
		ctx.JSON(http.StatusInternalServerError,
			model.BaseRes{
				Code: model.CodeErr,
				Msg:  model.MsgErr,
				Data: RegisterRes{
					Message: "Internal server error",
				},
			})
		return
	}
	ctx.JSON(http.StatusOK, model.BaseRes{
		Code: model.CodeOk,
		Msg:  model.MsgOk,
		Data: RegisterRes{
			Message: "User created successfully",
		},
	})
}

func (c *CmsApp) generateToken(ctx context.Context, userID string) (string, error) {
	token := uuid.New().String()
	// key : session_id:{user_id} val : session_id  20s
	sessionKey := utils.GetSessionKey(userID)
	err := c.redis.Set(ctx, sessionKey, token, time.Hour*8).Err()
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	authKey := utils.GetAuthKey(token)
	err = c.redis.Set(ctx, authKey, time.Now().Unix(), time.Hour*8).Err()
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	return token, nil
}
