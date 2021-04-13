$(document).ready(()=>{
    $("#openModal").click((event)=>{
        event.preventDefault();

        openModal();
    });

    $("#close").click((event)=>{
        event.preventDefault();

        closeModal();
    })
});

function openModal(){
    $(document.body).addClass("modal-opened");

    $("#feedback").css("display", "flex");
}

function closeModal(){
    $(document.body).removeClass("modal-opened");

    $("#feedback").css("display", "none");
}