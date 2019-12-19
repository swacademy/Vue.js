// 예제 애플리케이션에 사용할 더미 인증 Module
var Auth = {
    login: function (email, pass, cb) {
        // 더미 데이터를 사용한 가짜 로그인
        setTimeout(function () {
            if (email === 'vue@example.com' && pass === 'vue') {
                // 로그인 성공시 로컬 스토리지에 token을 저장
                localStorage.token = Math.random().toString(36).substring(7)
                if (cb) { cb(true) }
            } else {
                if (cb) { cb(false) }
            }
        }, 0)
    },

    logout: function () {
        delete localStorage.token
    },

    loggedIn: function () {
        // 로컬 스토리지에 token이 있으면 로그인 상태로 간주함
        return !!localStorage.token
    }
}

// 더미 데이터 정의. 원래는 이 정보가 데이터베이스에 있고 API를 통해 받아와야 함
var userData = [
    {
        id: 1,
        name: 'Michael Jackson',
        description: 'Vue.js Front-end Developer 입니다.'
    },
    {
        id: 2,
        name: 'Sujan Smith',
        description: '아웃도어, 풋살이 취미인 엔지니어입니다.'
    }
]

// 가짜 API를 통해 정보를 받아온 흉내를 냄
var getUsers = function (callback) {
    setTimeout(function () {
        callback(null, userData)
    }, 1000)
}

var getUser = function (userId, callback) {
    setTimeout(function () {
        var filteredUsers = userData.filter(function (user) {
            return user.id === parseInt(userId, 10)
        })
        callback(null, filteredUsers && filteredUsers[0])
    }, 1000)
}

// 가짜 API를 통해 정보를 수정한 흉내를 냄.
// 실제 웹 애플리케이션이면 이 부분에서 서버에 POST 요청을 보냄
var postUser = function (params, callback) {
    setTimeout(function () {
        // id가 추가될 때마다 자동으로 increment 됨
        params.id = userData.length + 1
        userData.push(params)
        callback(null, params)
    }, 1000)
}

// 로그인 컴포넌트
var Login = {
    template: '#login',
    data: function () {
        return {
            email: 'vue@example.com',
            pass: '',
            error: false
        }
    },
    methods: {
        login: function () {
            Auth.login(this.email, this.pass, (function (loggedIn) {
                if (!loggedIn) {
                    this.error = true
                } else {
                    // redirect 파라미터가 있으면 해당 경로로 이동
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            }).bind(this))
        }
    }
}

// 사용자 목록 컴포넌트
var UserList = {
    template: '#user-list',
    data: function () {
        return {
            loading: false,
            users: function () {
                return []
            },
            error: null
        }
    },

    created: function () {
        this.fetchData()
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        fetchData: function () {
            this.loading = true
            getUsers((function (err, users) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.users = users
                }
            }).bind(this))
        }
    }
}

// 사용자 상세 정보 Component
var UserDetail = {
    template: '#user-detail',
    data: function () {
        return {
            loading: false,
            user: null,
            error: null
        }
    },

    created: function () {
        this.fetchData()
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        fetchData: function () {
            this.loading = true
            // this.$route.params.userId에 현재 URL의 userId 값을 저장함
            getUser(this.$route.params.userId, (function (err, user) {
                this.loading = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.user = user
                }
            }).bind(this))
        }
    }
}

// 신규 사용자 등록 Component
var UserCreate = {
    template: '#user-create',
    data: function () {
        return {
            sending: false,
            user: this.defaultUser(),
            error: null
        }
    },

    created: function () {
    },

    methods: {
        defaultUser: function () {
            return {
                name: '',
                description: ''
            }
        },

        createUser: function () {
            // 입력 파라미터 유효성 검사
            if (this.user.name.trim() === '') {
                this.error = 'Name은 필수입니다'
                return
            }
            if (this.user.description.trim() === '') {
                this.error = 'Description은 필수입니다'
                return
            }
            postUser(this.user, (function (err, user) {
                this.sending = false
                if (err) {
                    this.error = err.toString()
                } else {
                    this.error = null
                    // 기본값으로 폼을 리셋
                    this.user = this.defaultUser()
                    alert('신규 사용자가 등록되었습니다')
                    // 사용자 목록 페이지로 돌아감
                    this.$router.push('/users')
                }
            }).bind(this))
        }
    }
}

// 옵션을 지정해 라우터 인스턴스를 생성
var router = new VueRouter({
    // 각 라우트에 컴포넌트를 매핑
    // 컴포넌트는 생성자로 만든 것이든 옵션으로 만든 것이든 상관없음
    routes: [
        {
            path: '/top',
            component: {
                template: '<div>최상위 페이지 입니다</div>'
            }
        },
        {
            path: '/users',
            component: UserList
        },
        {
            path: '/users/new',
            component: UserCreate,
            beforeEnter: function (to, from, next) {
                // 비로그인 상태에서 접근하면 login 페이지로 이동
                if (!Auth.loggedIn()) {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    })
                } else {
                    // 로그인 상태라면 신규 사용자 등록 페이지로
                    next()
                }
            }
        },
        {
            // /users/new보다 앞에 이 라우트를 정의하면 /user/new가 동작하지 않음
            path: '/users/:userId',
            component: UserDetail
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/logout',
            beforeEnter: function (to, from, next) {
                Auth.logout()
                next('/top')
            }
        },
        {
            // 정의되지 않은 경로 처리. 최상위 페이지로 리다이렉트
            path: '*',
            redirect: '/top'
        }
    ]
})


// 라우터 인스턴스를 루트 Vue 인스턴스에 전달
var app = new Vue({
    data: {
        Auth: Auth
    },
    router: router
}).$mount('#app')