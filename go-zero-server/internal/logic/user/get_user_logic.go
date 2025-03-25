package user

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"
	"auth/model/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserLogic {
	return &GetUserLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserLogic) GetUser(req *types.GetUserRequest) (resp *types.GetUserResponse, err error) {
	id := req.Id
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
			Id:       id,
			Username: u.Username,
		},
	}, nil
}
