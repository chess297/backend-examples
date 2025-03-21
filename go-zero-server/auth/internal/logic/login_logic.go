package logic

import (
	"context"
	"fmt"
	"time"

	"auth/internal/svc"
	"auth/internal/types"
	"auth/internal/utils"
	"auth/model/user"

	"github.com/google/uuid"
	"github.com/zeromicro/go-zero/core/logx"
	"golang.org/x/crypto/bcrypt"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.LoginRequest) (resp *types.LoginResponse, err error) {
	_,err =user.NewUsersModel(l.svcCtx.Mysql).FindOneByUsername(l.ctx,req.Username)
	if err!= nil {
		return nil,err
	}
	
	hashedPassword, err := encryptPassword(req.Password)
	if err!= nil {
		return nil,err
	}
	if err:= bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err!= nil {
		return nil,err
	}
	// 生成token
	token, err := l.generateToken(req.Username)
	if err!= nil {
		return nil,err
	}

	return &types.LoginResponse{
		Token: token,
	},nil
}

func encryptPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("bcrypt generate from password error  = %v", err)
		return "", err
	}
	return string(hashedPassword), err
}


func (l *LoginLogic) generateToken( userID string) (string, error) {
	token := uuid.New().String()
	// key : session_id:{user_id} val : session_id  20s
	sessionKey := utils.GetSessionKey(userID)
	err := l.svcCtx.Redis.Set( sessionKey, token)
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	authKey := utils.GetAuthKey(token)
	err = l.svcCtx.Redis.Set( authKey, time.Now().String() )
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	return token, nil
}
