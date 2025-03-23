package logic

import (
	"context"

	"auth/internal/svc"
	"auth/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HelloLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHelloLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HelloLogic {
	return &HelloLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HelloLogic) Hello() (resp *types.HelloResponse, err error) {
	name := l.ctx.Value("name")
	if name != nil {
		return &types.HelloResponse{
			BaseResponse: types.BaseResponse{
				Code: 0,
				Msg:  "success",
			},
			Data: struct {
				Message string `json:"message"`
			}{
				Message: name.(string),
			},
		}, nil
	}
	return &types.HelloResponse{
		BaseResponse: types.BaseResponse{
			Code: 1,
			Msg:  "error",
		},
		Data: struct {
			Message string `json:"message"`
		}{
			Message: "error",
		},
	}, nil

}
