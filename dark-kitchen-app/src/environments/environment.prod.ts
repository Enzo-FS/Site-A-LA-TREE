export const environment = {
  production: true,
  // Banco principal: autenticação, pedidos, cadastros de usuário
  firebase: {
    apiKey: 'AIzaSyD35prCYCEVcktu7UlSQgTH9WdI-oGkSX4',
    authDomain: 'cardapio-a-la-tree.firebaseapp.com',
    projectId: 'cardapio-a-la-tree',
    storageBucket: 'cardapio-a-la-tree.firebasestorage.app',
    messagingSenderId: '703440552189',
    appId: '1:703440552189:web:07399abbc71c8d16f57e94',
  },
  // Banco do gerenciador: catálogo (cardapio) cadastrado no painel administrativo
  firebaseGerencia: {
    apiKey: 'AIzaSyCZZMXATFcoeIOkRe9TNB3M-aEarO76SJk',
    authDomain: 'gerencia-a-la-tree.firebaseapp.com',
    projectId: 'gerencia-a-la-tree',
    storageBucket: 'gerencia-a-la-tree.firebasestorage.app',
    messagingSenderId: '361601588662',
    appId: '1:361601588662:web:3f1cc76a00a7df66ccf517',
  },
};