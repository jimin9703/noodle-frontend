import { ActionContext } from 'vuex'
import { AuthenticationState } from './states'
import axios, { AxiosResponse } from 'axios'
import axiosInst from "@/utility/axiosInstance"

export type AuthenticationActions = {
    requestGithubOauthRedirectionToDjango(): Promise<void>,
    requestAccessTokenToDjangoRedirection(
        context: ActionContext<AuthenticationState, any>,
        payload: { code: string }): Promise<void>
    requestUserInfoToDjango(
        context: ActionContext<AuthenticationState, any>): Promise<any>
}

const actions: AuthenticationActions = {
    async requestGithubOauthRedirectionToDjango(): Promise<void> {
        return axiosInst.djangoAxiosInst.get('/github-oauth/github').then((res) => {
            window.location.href = res.data.url
        })
    },
    async requestAccessTokenToDjangoRedirection(
        context: ActionContext<AuthenticationState, any>,
        payload: { code: string }): Promise<void> {
        try {
            console.log('requestAccessTokenToDjangoRedirection()')
            const { code } = payload

            const response = await axiosInst.djangoAxiosInst.post(
                '/github-oauth/github/access-token', { code })
            console.log("accessToken:", response)
            localStorage.setItem("accessToken", response.data.code)
        } catch (error) {
            console.log("Access Token 요청 중 문제 발생:", error)
            throw error
        }
    },
    async requestUserInfoToDjango(
        context: ActionContext<AuthenticationState, any>): Promise<any> {
        try {
            const accessToken = localStorage.getItem('accessToken')
            const userInfoResponse: AxiosResponse<any> = await axiosInst.djangoAxiosInst.post(
                '/github-oauth/github/user-info', { access_token: accessToken }
            )
            console.log("userInfo:", userInfoResponse)
            const userInfo = userInfoResponse.data.user_info
            return userInfo
        } catch (error) {
            alert('사용자 정보 가져오기 실패!')
            throw error
        }
    }   
}

export default actions;