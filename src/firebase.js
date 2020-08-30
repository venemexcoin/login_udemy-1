import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAV5gFmMRAwLWh_JxcqNhUs3n_o1csRYyU',
  authDomain: 'auth-firebase-d6015.firebaseapp.com',
  databaseURL: 'https://auth-firebase-d6015.firebaseio.com',
  projectId: 'auth-firebase-d6015',
  storageBucket: 'auth-firebase-d6015.appspot.com',
  messagingSenderId: '81402910838',
  appId: '1:81402910838:web:6d048658e276809a862757'
}
// Initialize Firebase
app.initializeApp(firebaseConfig)

const db = app.firestore()
const auth = app.auth()

export { auth, db }
