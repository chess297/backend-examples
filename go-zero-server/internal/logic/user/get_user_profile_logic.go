package user

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"
	"auth/internal/utils/token"
	"auth/model/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type Request struct {
	Authorization string `header:"authorization"`
}

type GetUserProfileLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserProfileLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserProfileLogic {
	return &GetUserProfileLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserProfileLogic) GetUserProfile(req *Request) (resp *types.GetUserResponse, err error) {
	a := req.Authorization[7:]
	if a == "" {
		return &types.GetUserResponse{
			BaseResponse: types.BaseResponse{
				Code: 1,
				Msg:  "未登录",
			},
		}, nil
	}

	payload, err := token.ParseJwtToken(a, l.svcCtx.Config.Auth.AccessSecret)
	if err != nil {
		return &types.GetUserResponse{
			BaseResponse: types.BaseResponse{
				Code: 1,
				Msg:  "未登录",
			},
		}, nil
	}

	id := payload.UserID
	u, err := user.NewUsersModel(l.svcCtx.Mysql).FindOne(l.ctx, int64(id))
	if err != nil {
		return nil, err
	}

	return &types.GetUserResponse{
		BaseResponse: types.BaseResponse{
			Code: 0,
			Msg:  "success",
		},
		Data: types.GetUserResponseData{
			Id:       int(u.Id),
			Username: u.Username,
		},
	}, nil
}
