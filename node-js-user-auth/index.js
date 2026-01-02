import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null }
    
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        req.session.user = data
    } catch {}

    next() // -> seguir a la siguiente ruta o middleware
})

app.get('/', (req, res) => {
    const { user } = req.session
    res.render('index', user)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await UserRepository.login({ username, password })
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: '1h'
            })
        
        const refreshedToken = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: "7d",
            }
        );
        
        res.cookie('access_token', token, {
            httpOnly: true, // la cookie solo se puede acceder desde el servidor
            secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60// la cookie solo se puede acceder en el mismo dominio
        })
            .send({ user, token })
    } catch (e) {
        res.status(401).send(e.message)
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body // ????
    console.log(req.body)

    try {
        const id = await UserRepository.create({ username, password })
        res.send({ id })
    } catch (error) {
        // NORMALMENTE NO ES BUENA IDEA MANDAR EL ERROR DEL REPO.
        res.status(400).send ({ error })
    }
})
app.post('/logout', (req, res) => {
    res
        .clearCookie('access_token')
        .json({ message: 'Logout successful'})
})

app.get('/protected', (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send('Access not authorized')
    res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
