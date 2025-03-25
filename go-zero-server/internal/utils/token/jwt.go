package token

import (
	"errors"

	"github.com/golang-jwt/jwt"
)

type JwtTokenPayload struct {
	UserID   int64  `json:"user_id"`
	UserName string `json:"user_name"`
}

// @secretKey: JWT 加解密密钥
// @iat: 时间戳
// @seconds: 过期时间，单位秒
// @payload: 数据载体
func GenJwtToken(secretKey string, iat, seconds int64, payload JwtTokenPayload) (string, error) {
	claims := make(jwt.MapClaims)
	claims["exp"] = iat + seconds
	claims["iat"] = iat
	claims["payload"] = payload
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims = claims
	return token.SignedString([]byte(secretKey))
}

func ParseJwtToken(token string, secretKey string) (*JwtTokenPayload, error) {
	// 定义自定义Claims结构
	type customClaims struct {
		Payload JwtTokenPayload `json:"payload"`
		jwt.StandardClaims
	}

	tokenClaims, err := jwt.ParseWithClaims(token, &customClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := tokenClaims.Claims.(*customClaims); ok && tokenClaims.Valid {
		return &claims.Payload, nil
	}

	return nil, errors.New("invalid token claims")
}
