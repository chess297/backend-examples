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
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRes struct {
	// Id 		int64 	`json:"id" binding:"required"`
	Message string 	`json:"message" binding:"required"`
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
	userDao:= dao.NewUserDao(c.db)
	// 判断用户是否存在
	isExist, err := userDao.IsExist(req.Username)
	if err!= nil && err!= gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
			"error": err.Error(),
		})
		return
	}
	if isExist {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "User already exists",
			"error": err.Error(),
		})
		return
	}

	// 处理数据库创建用户逻辑

	hashedPassword, err := encryptPassword(req.Password)
	if err!= nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
			"error": err.Error(),
		})
		return
	}
	
	now:= time.Now()
	user:= &model.User{
		Username: req.Username,
		Password: hashedPassword,
		Ct: now,
		Ut: now,
	}
	if err:=userDao.Create(user);err!=nil{
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"code":0,
		"msg": "User created successfully",
		"data": RegisterRes{
			// Id: user.Id,
			Message: "User created successfully",
		},
	})
}

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRes struct {
	Token string `json:"token" binding:"required"`
}

// 登录用户
func (c *CmsApp) Login(ctx *gin.Context) {
	var req LoginReq
	if err := ctx.ShouldBindJSON(&req); err!= nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}
	// 连接数据库
	userDao:= dao.NewUserDao(c.db)
	// 判断用户是否存在
	isExist, err := userDao.IsExist(req.Username)
	if err!= nil && err!= gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
			"error": err.Error(),
		})
		return
	}
	if !isExist {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "User does not exist",
			"error": err.Error(),
		})
		return
	}
	// 处理数据库创建用户逻辑
	user, err:= userDao.GetUserByUsername(req.Username)
	if err!= nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
		})
		return
	}
	if err:= bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err!= nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Username or Password is incorrect",
		})
		return
	}

	// 生成token
	token, err := c.generateToken(ctx, user.Username)
	if err!= nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
		})
	}
	
	ctx.JSON(http.StatusOK, gin.H{
		"code":0,
		"msg": "Login successfully",
		"data": LoginRes{
			Token: token,
		},
	})
}


func encryptPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("bcrypt generate from password error  = %v", err)
		return "", err
	}
	return string(hashedPassword), err
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
