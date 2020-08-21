const address = window.location.search
            
setTimeout(function() {
    window.location.href = ("/study" + address) 
}, 2000)

document.querySelector('#gotolist')
.addEventListener('click', function() {
    window.location.href = ("/study" + address)})

