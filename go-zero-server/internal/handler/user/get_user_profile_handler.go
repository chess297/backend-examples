package user

import (
	"net/http"

	"auth/internal/logic/user"
	"auth/internal/svc"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetUserProfileHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := user.NewGetUserProfileLogic(r.Context(), svcCtx)
		resp, err := l.GetUserProfile(&user.Request{
			Authorization: r.Header.Get("Authorization"),
		})
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
