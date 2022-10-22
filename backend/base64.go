package main

import (
	b64 "encoding/base64"
	"math/big"
)

func encode(id int) string {
	// url = strings.ToUpper(url)
	// urlb := []byte(url)
	// for i, _ := range urlb {
	// 	urlb[i] -= byte('.')
	// }
	// encoded_url := b64.StdEncoding.EncodeToString(urlb)
	// encoded_url = strings.Replace(encoded_url, "+", "-", -1)
	// encoded_url = strings.Replace(encoded_url, "/", "_", -1)

	eb := big.NewInt(int64(id))
	encoded_url := b64.RawURLEncoding.EncodeToString(eb.Bytes())

	return encoded_url
}

func decode(encoded_url string) (int, error) {
	// encoded_url = strings.Replace(encoded_url, "-", "+", -1)
	// encoded_url = strings.Replace(encoded_url, "_", "/", -1)
	// decoded_url, err := b64.StdEncoding.DecodeString(encoded_url)
	// durlb := []byte(decoded_url)
	// for i, _ := range durlb {
	// 	durlb[i] += byte('.')	
	// }
	// durls := string(durlb[:])
	// durls = strings.ToLower(durls)
	// if err != nil {
	// 	return "", err
	// }

	dec_url, err := b64.RawURLEncoding.DecodeString(encoded_url)
	c := 0
	cb := big.NewInt(int64(c))
	cb.SetBytes(dec_url)
	if err != nil {
		return -1, err
	}

	return int(cb.Int64()), nil
}