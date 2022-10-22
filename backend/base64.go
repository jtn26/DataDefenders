package main

import (
	b64 "encoding/base64"
	"strings"
)

func encode(url string) string {
	url = strings.ToUpper(url)
	urlb := []byte(url)
	for i, _ := range urlb {
		urlb[i] -= byte('.')
	}
	encoded_url := b64.StdEncoding.EncodeToString(urlb)
	encoded_url = strings.Replace(encoded_url, "+", "-", -1)
	encoded_url = strings.Replace(encoded_url, "/", "_", -1)

	return encoded_url
}

func decode(encoded_url string) (string, error) {
	encoded_url = strings.Replace(encoded_url, "-", "+", -1)
	encoded_url = strings.Replace(encoded_url, "_", "/", -1)
	decoded_url, err := b64.StdEncoding.DecodeString(encoded_url)
	durlb := []byte(decoded_url)
	for i, _ := range durlb {
		durlb[i] += byte('.')	
	}
	durls := string(durlb[:])
	durls = strings.ToLower(durls)
	if err != nil {
		return "", err
	}
	return durls, nil
}