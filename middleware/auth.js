// Archivo que detectará si el usuario esta logeado, si no lo manda a raiz
export default function ({ $auth, redirect }) {
  if (!$auth.loggedIn) {
    return redirect('/')
  }
}
