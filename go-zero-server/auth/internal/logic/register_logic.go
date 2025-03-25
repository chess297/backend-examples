package logic

import (
	"context"
	"time"

	"auth/internal/svc"
	"auth/internal/types"
	"auth/model/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type RegisterLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRegisterLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RegisterLogic {
	return &RegisterLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *RegisterLogic) Register(req *types.RegisterRequest) (resp *types.RegisterResponse, err error) {
	model := user.NewUsersModel(l.svcCtx.Mysql)
	// 查看用户是否已经存在
	u, err := model.FindOneByUsername(l.ctx, req.Username)
	if err != nil {
		return &types.RegisterResponse{}, err
	}
	if u != nil {
		return &types.RegisterResponse{
			BaseResponse: types.BaseResponse{
				Code: 1,
				Msg:  "error",
			},
			Data: types.RegisterResponseData{
				Message: "用户已经存在",
			},
		}, err
	}

	// 插入用户
	now := time.Now()
	_, err = model.Insert(l.ctx, &user.Users{
		Username:   req.Username,
		Password:   req.Password,
		CreateTime: now,
		UpdateTime: now,
	})
	return &types.RegisterResponse{
		BaseResponse: types.BaseResponse{
			Code: 0,
			Msg:  "success",
		},
		Data: types.RegisterResponseData{
			Message: "注册成功",
		},
	}, err
}
