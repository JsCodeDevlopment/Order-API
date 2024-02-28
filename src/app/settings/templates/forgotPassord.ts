export function TemplateForgotPassword(resetLink: string) {
    return `<body style="background-color: #2B2B2B; width: 100%; height: auto; margin: 0; text-align: center; color: #FFF; font-family: Arial, sans-serif;">

    <div style="width: 100%; max-width: 1082px; text-align: center; padding: 20px;">
        <img src="${process.env.BASE_URL}/logo.png" alt="Logo" width="200">    
    </div>

    <div style="width: 100%; max-width: 1082px; text-align: center; padding: 20px;">
        <h2 style="color: #E6324B;">Redefinição de Senha</h2>
        <p>Opa! Falta pouco para você recuperar sua senha, tudo que precisa fazer agora é clicar no botão abaixo e escolher uma nova senha.</p>
        <div style="padding: 10px; text-align: center;">
            <a href="${resetLink}" style="text-decoration: none; cursor: pointer;">
              <button style="background-color: #E6324B; marim-top: 0; marim-right: auto; marim-bottom: 0; marim-left: auto; color: #FFF; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">Clique para Redefinir</button>
            </a>
        </div>
    </div>

    <div style="height: auto; width: 100%; max-width: 1082px; background-color: #000; color: #FFF; text-align: center; padding: 10px; bottom: 0;">
    <p style="color: #E6324B;">PickApp</p>
    <p>© Todos os direitos reservados.</p>
    <p>Designed by <a href="https://jonatas-silva-developer.vercel.app/" style="color: #FFF; text-decoration: none;">Jonatas</a></p>
    </div>

    </body>`;
}
