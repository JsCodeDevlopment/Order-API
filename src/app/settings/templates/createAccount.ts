export function TemplateCreateAccount(verificationLink: string) {
  
  return `<body style="background-color: #2B2B2B; color: #FFF; font-family: Arial, sans-serif;">
    <div style="text-align: center; padding: 20px;">
    <img src="${process.env.BASE_URL}/logo.png" alt="Logo" width="200">
    </div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #E6324B;">Verifique seu email!</h2>
      <p>Parabéns, falta pouco para você concluir a criação de sua conta!</p>
      <p>Copie o token abaixo e cole no sistema para verificar seu e-mail e usar sua conta.</p>
      <div style="background-color: #f0f0f0; padding: 10px; margin-top: 20px;">
          <p style="font-size: 18px; color: #333; margin: 0;">Token: <span style="font-weight: bold; color: #007bff;">${verificationLink}</span></p>
      </div>
  </div>
  <div style="background-color: #000; color: #FFF; text-align: center; padding: 10px; position: fixed; bottom: 0; width: 100%;">
      <p style="color: #E6324B;">PickApp</p>
      <p>© Todos os direitos reservados.</p>
      <p>Designed by <a href="https://jonatas-silva-developer.vercel.app/" style="color: #FFF; text-decoration: none;">Jonatas</a></p>
    </div>
  </body>`;
}
