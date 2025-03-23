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
	u, err := user.NewUsersModel(l.svcCtx.Mysql).FindOneByUsername(l.ctx, req.Username)
	if err != nil {
		return nil, err
	}

	if err := utils.ComparePassword(u.Password, req.Password); err != nil {
		return &types.LoginResponse{
			BaseResponse: types.BaseResponse{
				Code: 1,
				Msg:  "用户名或密码错误",
			},
		}, err
	}
	// 生成token
	token, err := l.generateToken(req.Username)
	if err != nil {
		return nil, err
	}

	return &types.LoginResponse{
		BaseResponse: types.BaseResponse{
			Code: 0,
			Msg:  "success",
		},
		Data: struct {
			Token string `json:"token"`
		}{
			Token: token,
		},
	}, err
}

func (l *LoginLogic) generateToken(userID string) (string, error) {
	token := uuid.New().String()
	// key : session_id:{user_id} val : session_id  20s
	sessionKey := utils.GetSessionKey(userID)
	err := l.svcCtx.Redis.Set(sessionKey, token)
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	authKey := utils.GetAuthKey(token)
	err = l.svcCtx.Redis.Set(authKey, time.Now().String())
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	return token, nil
}
