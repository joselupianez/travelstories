const alertButton = document.querySelectorAll('.alert').forEach(a => {
    a.querySelector('.alert-button').addEventListener('click', () => {
        a.remove()
    })
})

CKEDITOR.replace('body', {
    plugins: 'wysiwygarea, toolbar, basicstyles, link'
})