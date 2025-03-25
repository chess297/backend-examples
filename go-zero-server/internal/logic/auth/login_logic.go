package auth

import (
	"context"
	"time"

	"auth/internal/svc"
	"auth/internal/types"
	"auth/internal/utils"
	"auth/internal/utils/token"
	"auth/model/user"

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
	token, err := token.GenJwtToken(l.svcCtx.Config.Auth.AccessSecret, time.Now().Unix(), time.Now().Unix()+l.svcCtx.Config.Auth.AccessExpire, token.JwtTokenPayload{
		UserID:   u.Id,
		UserName: u.Username,
	})
	if err != nil {
		return nil, err
	}

	return &types.LoginResponse{
		BaseResponse: types.BaseResponse{
			Code: 0,
			Msg:  "success",
		},
		Data: types.LoginResponseData{
			Token: token,
		},
	}, err
}
