
// Formulario de contato - Validação em JavaScript puro
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const charCount = document.getElementById('charCount');
    const mensagemField = document.getElementById('mensagem');

    // Contador de caracteres para o campo mensagem
    if (mensagemField && charCount) {
        mensagemField.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Atualizar cor do contador baseado no mínimo necessário
            if (count >= 20) {
                charCount.style.color = '#22c55e'; // Verde
            } else {
                charCount.style.color = '#9ca3af'; // Cinza
            }
        });
    }

    // Função para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para mostrar erro em um campo
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + 'Error');
        
        if (field && errorDiv) {
            field.classList.add('error');
            errorDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                ${message}
            `;
        }
    }

    // Função para limpar erro de um campo
    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + 'Error');
        
        if (field && errorDiv) {
            field.classList.remove('error');
            errorDiv.innerHTML = '';
        }
    }

    // Função para limpar todos os erros
    function clearAllErrors() {
        const fields = ['nome', 'email', 'assunto', 'mensagem'];
        fields.forEach(field => clearFieldError(field));
    }

    // Função para validar formulário
    function validateForm() {
        clearAllErrors();
        let isValid = true;

        // Validar nome
        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            showFieldError('nome', 'Nome é obrigatório');
            isValid = false;
        }

        // Validar email
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showFieldError('email', 'E-mail é obrigatório');
            isValid = false;
        } else if (!validateEmail(email)) {
            showFieldError('email', 'Formato de e-mail inválido');
            isValid = false;
        }

        // Validar assunto
        const assunto = document.getElementById('assunto').value.trim();
        if (!assunto) {
            showFieldError('assunto', 'Assunto é obrigatório');
            isValid = false;
        }

        // Validar mensagem
        const mensagem = document.getElementById('mensagem').value.trim();
        if (!mensagem) {
            showFieldError('mensagem', 'Mensagem é obrigatória');
            isValid = false;
        } else if (mensagem.length < 20) {
            showFieldError('mensagem', 'Mensagem deve ter no mínimo 20 caracteres');
            isValid = false;
        }

        return isValid;
    }

    // Função para mostrar mensagem de status
    function showMessage(type) {
        // Esconder todas as mensagens primeiro
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Mostrar a mensagem apropriada
        if (type === 'success') {
            successMessage.style.display = 'flex';
            // Scroll suave para a mensagem
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (type === 'error') {
            errorMessage.style.display = 'flex';
            // Scroll suave para a mensagem
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Esconder mensagem após 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Função para resetar formulário
    function resetForm() {
        form.reset();
        clearAllErrors();
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#9ca3af';
        }
    }

    // Limpar erros quando o usuário começar a digitar
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            clearFieldError(this.id);
        });
    });

    // Manipular envio do formulário
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validar formulário
            if (!validateForm()) {
                showMessage('error');
                return;
            }

            // Desabilitar botão de envio
            submitBtn.disabled = true;
            submitText.textContent = 'Enviando...';
            
            // Adicionar spinner ao botão
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            spinner.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 018-8V4" opacity="0.75"></path>
                </svg>
            `;
            
            // Substituir ícone temporariamente
            const submitIcon = submitBtn.querySelector('.submit-icon');
            const originalIcon = submitIcon.innerHTML;
            submitIcon.innerHTML = spinner.innerHTML;

            try {
                // Simular envio (delay de 2 segundos)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Coletar dados do formulário
                const formData = {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    assunto: document.getElementById('assunto').value,
                    mensagem: document.getElementById('mensagem').value
                };

                // Log dos dados (em produção, aqui seria o envio para servidor)
                console.log('Dados do formulário enviados:', formData);

                // Mostrar mensagem de sucesso
                showMessage('success');
                
                // Resetar formulário
                resetForm();

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showMessage('error');
            } finally {
                // Reabilitar botão e restaurar estado original
                submitBtn.disabled = false;
                submitText.textContent = 'Enviar Mensagem';
                submitIcon.innerHTML = originalIcon;
            }
        });
    }

    // Adicionar CSS para animação de spin
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});

// Função para scroll suave nos links da navegação (caso sejam adicionadas âncoras)
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Log de inicialização
console.log('FotoDigital - Site carregado com sucesso!');
console.log('Validação de formulário ativa.');