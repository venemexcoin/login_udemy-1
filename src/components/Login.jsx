import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'

const Login = props => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [esRegistro, setEsRegistro] = useState(true)
  const [error, setError] = useState(null)

  const mostrarAlert = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: 'Requiere Email',
      toast: true,
      showConfirmButton: false,
      timer: 1500
    })
  }

  const mostrarpass = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: 'Requiere un Passwor',
      toast: true,
      showConfirmButton: false,
      timer: 1500
    })
  }

  const mostrarvali = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Debe tener mas de 6 caracteres',
      toast: true,
      showConfirmButton: false,
      timer: 1500
    })
  }

  const prosesarDatos = e => {
    e.preventDefault()
    if (!email.trim()) {
      mostrarAlert()
      return
    }
    if (!pass.trim()) {
      console.log('Ingrese Password')
      mostrarpass()
      return
    }

    if (pass.length < 6) {
      console.log('password mayor a 6 Carácteres')
      mostrarvali()
      return
    }

    if (esRegistro) {
      registrar()
    } else {
      login()
    }
  }

  const login = React.useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass)
      console.log(res.user)
      setEmail('')
      setPass('')
      setError(null)
      props.history.push('/admin')
    } catch (error) {
      console.log(error)
      if (error.code === 'auth/invalid-email') {
        setError('Email no valido')
      }
      if (error.code === 'auth/user-not-found') {
        setError('Email no registrado')
      }
      if (error.code === 'auth/wrong-password') {
        setError('Password incorrecto')
      }
    }
  }, [email, pass, props.history])

  const registrar = React.useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass)
      // console.log(res.user)
      await db
        .collection('usuarios')
        .doc(res.user.email)
        .set({
          email: res.user.email,
          uid: res.user.uid,
          saldo: 0.0
        })

      await db.collection(res.user.uid).add({
        name: 'Tarea de prueba',
        fecha: Date.now()
      })

      setEmail('')
      setPass('')
      setError(null)
      props.history.push('/admin')
    } catch (error) {
      console.log(error)
      if (error.code === 'auth/email-already-in-use') {
        setError('Email no ya registrado')
      }
      if (error.code === 'auth/invalid-email') {
        setError('Email no usado')
      }
    }
  }, [email, pass, props.history])

  return (
    <div className='mt-5'>
      <h3 className='text-center'>
        {esRegistro ? 'Registro de usuario' : 'Login de acceso'}
      </h3>
      <hr />
      <div className='row justtify-content-center'>
        <div className='col-12 col-sm8 col-sd-6 col-xl-4'>
          <form onSubmit={prosesarDatos}>
            {error && <div className='alert alert-danger'>{error}</div>}
            <input
              type='email'
              className='form-control mb-2'
              placeholder='Ingrese un Email'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <input
              type='password'
              className='form-control mb-2'
              placeholder='Ingrese un password'
              onChange={e => setPass(e.target.value)}
              value={pass}
            />
            <button className='btm btn-dark btn-lg btn-block' type='submit'>
              {esRegistro ? 'Registrase' : 'Acceder'}
            </button>
            <button
              className='btn btn-info btn-sm btn-block'
              onClick={() => setEsRegistro(!esRegistro)}
              type='button'
            >
              {esRegistro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Login)
