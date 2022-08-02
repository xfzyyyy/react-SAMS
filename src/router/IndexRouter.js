import React from 'react'
import Login from '../views/login/Login'
import News from '../views/news/News'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Detail from '../views/news/Detail'
export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/news' component={News} exact />
                <Route path='/detail/:id' component={Detail} exact />

                <Route path='/login' render={() => localStorage.getItem("token") ? <Redirect to="/home" /> : <Login />} />
                {/* 如果没有登录，就要重定向Redirect */}
                <Route path='/' render={() => localStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />} />

            </Switch>

            {/* <Route path='/login' component={Login} />
            <Route path='/login' component={Login} /> */}
        </HashRouter>
    )
}
