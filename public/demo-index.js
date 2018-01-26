const germinationImages = ['seed-glasses.png', 'germination.png', 'water.png', 'plant.png', '3leafplant.png'];
const flowerImages = ['flower2.png', 'flowers.png', 'flowerbluepot.png', 'redleafplant.png', '3redflower.png', 'happyplant.png', 'palm-tree.png'];

//const baseURL = "http://localhost:3332/";
const baseURL = "https://rocky-island-77568.herokuapp.com/";

const userId = "5a68bc56ab44f81be9074ffb"; 

function createGoal() {
    $('.demo-create-goal').submit(event => {
        event.preventDefault();
        const goalTitle = $('input[name="goal"]').val();
        const goalStart = $('input[name="start-date"]').val();
        const goalEnd = $('input[name="end-date"]').val();

        const newGoal = {
            name: goalTitle,
            startDate: goalStart,
            endDate: goalEnd,
            userId: userId
        }
        $('input[name="goal"]').val('');
        $('input[name="start-date"]').val('');
        $('input[name="end-date"]').val('');

        $.ajax({
            url: baseURL + 'demo/create',
            headers: { "authorization": localStorage.getItem('token') },
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(newGoal),
            success: function(data) {
                swal("Hooray!", "Your goal was created", "success");
                $('.list-goals').append(`<div class="my-goals" value="${data.data.name}"><img class="seed" value="${data.data._id}" src="images/germination.png"><p value="${data.data._id}">${data.data.name}</p></div>`);

            },
            error: function(error) {}
        });
    })
};

function displayGoals() {
        
    
        $('.garden').html(`<h2>Click on a goal to enter actions!</h2><img class="action-seed" src="images/seed-glasses.png">`);

        $.ajax({

            url: baseURL + 'demo/all/' + userId,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',

            success: function(data) {
                renderGoals(data.data);

            },
            error: function(error) {
                console.log(error);
            }

        });
    

};

function renderGoals(goals) {
    $('.list-goals').html(`<h2>Goals:</h2>`);
    goals.forEach((goal) => {
        $('.list-goals').append(`
                    
                    <div class="my-goals" value="${goal.name}">
                    <img class="seed" value="${goal._id}" src="images/germination.png">
                    <p value="${goal._id}">${goal.name}</p>

                    </div>`);
    })
    $('.garden').html(`<h2>Click on a goal to enter actions!</h2><img class="action-seed" src="images/seed-glasses.png">`);

};

function displaySelectedGoal() {
    $('body').on('click', '.my-goals', (event) => {
        $('.garden').show();
        $('html, body').animate({
            scrollTop: ($('.garden').offset().top)
        }, 500);
        $('.garden').html(`<i class="fa fa-times fa-2x delete" aria-hidden="true" title="Delete goal"></i>`);
        $('.garden').append(`<h2>Enter actions:</h2>`);
        $('.garden').append(`<div>
                                <input type="text" class="new-action" name="action" placeholder="Enter an action here..." required/>
                                <input type="hidden" class="hidden-id" name="id" value="${event.target.attributes.value.nodeValue}">
                             </div>`);
        $('.garden').append(`<div><input type="submit" class="action-submit" name="submit" value="Submit action"></div>`);

        $.ajax({
            url: baseURL + 'demo/getbyid/' + event.target.attributes.value.nodeValue,
            
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',

            success: function(result) {
                let goal = result.data;
                let imageUrl;
                if (goal.actions.length < germinationImages.length) {
                    imageUrl = `images/${germinationImages[goal.actions.length]}`;
                } else {
                    let randomPosition = Math.floor(Math.random() * (flowerImages.length));
                    imageUrl = `images/${flowerImages[randomPosition]}`;
                }
                $('.garden').append(`<img class="action-seed" src="${imageUrl}">`);
                $('.garden').append(`<p>Actions taken for</p> <h3>${goal.name}:</h3>`);
                $('.garden').append(`<div class="actions"></div>`);
                goal.actions.forEach(action => {
                    $('.actions').append(`<p class="single-action">${action}</p>`);
                })
            },
            error: function(error) {
                console.log(error);
            }
        });

    })
};

function submitAction() {
    $('.garden').on('click', '.action-submit', (event) => {

        $.ajax({
            url: baseURL + 'demo/addaction/' + $('.hidden-id').val(),
            
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ action: $('.new-action').val() }),

            success: function(data) {
                console.log(data);
                let action = $('.new-action').val();
                $('.garden').append(`<p class="single-action">${action}</p>`);
                $('.new-action').val('');
                $('.action-seed').addClass('action-seed-shake');


                setTimeout(() => {
                    let goal = data.data
                    let imageUrl;

                    if ($('.single-action').length < germinationImages.length) {
                        imageUrl = `images/${germinationImages[goal.actions.length+1]}`;
                    } else {
                        let randomPosition = Math.floor(Math.random() * (flowerImages.length));
                        imageUrl = `images/${flowerImages[randomPosition]}`;
                    }
                    $('.action-seed').attr('src', `${imageUrl}`);
                    $('.action-seed').removeClass('action-seed-shake');

                }, 1000)


            },
            error: function(error) {

                swal("Oh no!", error.responseJSON.message, "error");
            }
        });
    })
};

function deleteAction() {
    $('.garden').on('click', '.delete', (event) => {
        console.log('delete button clicked');

        swal({
            title: 'Are you sure you want to delete this goal?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            buttons: [true, "Yes, delete it!"],

        }).then((result) => {
            console.log(result);
            if (result == true) {
                $.ajax({
                    url: baseURL + 'demo/remove/' + $('.hidden-id').val(),
                    
                    dataType: 'json',
                    type: 'delete',
                    contentType: 'application/json',

                    success: function(data) {
                        console.log(data);

                        swal("Poof", "Your goal was deleted!", "success");
                        $('.garden').html('');

                        displayGoals();
                    },
                    error: function(error) {
                        swal("Oh no!", error.responseJSON.message, "error");
                    }
                });

            }
        })


    })
};



$(createGoal);
$(displayGoals);
$(displaySelectedGoal);
$(submitAction);
$(deleteAction);


