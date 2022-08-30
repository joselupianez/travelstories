const alertButton = document.querySelectorAll('.alert-container').forEach(a => {
    a.querySelector('.alert-button').addEventListener('click', () => {
        a.remove()
    })
})

const mobileButton = document.querySelector('#menu-btn');
const nav = document.querySelector('#menu');

mobileButton.addEventListener('click', () => {
    mobileButton.classList.toggle('open')
    nav.classList.toggle('flex')
    nav.classList.toggle('hidden')
})

CKEDITOR.replace('body', {
    plugins: 'wysiwygarea, toolbar, basicstyles, link'
})