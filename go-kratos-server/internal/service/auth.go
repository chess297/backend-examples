package service

import (
	"context"

	pb "go-kratos-server/api/user/v1"
	"go-kratos-server/internal/biz"
)

type AuthService struct {
	pb.UnimplementedAuthServer
	uc *biz.UserUsecase
}

func NewAuthService(uc *biz.UserUsecase) *AuthService {
	return &AuthService{
		uc: uc,
	}
}

func (s *AuthService) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterReply, error) {
	err := s.uc.Register(ctx, &biz.User{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		return &pb.RegisterReply{
			Message: "fail",
		}, err
	}

	return &pb.RegisterReply{
		Message: "success",
	}, nil
}
func (s *AuthService) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginReply, error) {
	// s.uc.(ctx, &biz.User{})
	token, err := s.uc.Login(ctx, &biz.User{
		Username: req.Username,
		Password: req.Password,
	})
	if err != nil {
		return nil, err
	}

	return &pb.LoginReply{
		Token: token,
	}, nil

}

func (s *AuthService) Ping(ctx context.Context, req *pb.PingRequest) (*pb.PingReply, error) {
	return &pb.PingReply{
		Message: "pong",
	}, nil
}

func (s *AuthService) CreateAuth(ctx context.Context, req *pb.CreateAuthRequest) (*pb.CreateAuthReply, error) {
	return &pb.CreateAuthReply{}, nil
}
func (s *AuthService) UpdateAuth(ctx context.Context, req *pb.UpdateAuthRequest) (*pb.UpdateAuthReply, error) {
	return &pb.UpdateAuthReply{}, nil
}
func (s *AuthService) DeleteAuth(ctx context.Context, req *pb.DeleteAuthRequest) (*pb.DeleteAuthReply, error) {
	return &pb.DeleteAuthReply{}, nil
}
func (s *AuthService) GetAuth(ctx context.Context, req *pb.GetAuthRequest) (*pb.GetAuthReply, error) {
	return &pb.GetAuthReply{}, nil
}
func (s *AuthService) ListAuth(ctx context.Context, req *pb.ListAuthRequest) (*pb.ListAuthReply, error) {
	return &pb.ListAuthReply{}, nil
}
