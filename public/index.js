const images = ['seed.png', 'germination.png', 'water.png', 'plant.png', '3leafplant.png', 'flower2.png',
    'seed.png', 'germination.png', 'water.png', 'plant.png', '3leafplant.png', 'flowers.png',
    'seed.png', 'germination.png', 'water.png', 'plant.png', '3leafplant.png', 'flowerbluepot.png'
];

function checkUserLogin() {
    if (localStorage.getItem('token')) {
        console.log('user is logged in');

        $('.masthead').hide();
        $('.list-goals').show();
        $('.garden').show();
        $('.left-navbar').show();
        $('#logoutBtn').show();
        $('#signinBtn').hide();
        $('#loginBtn').hide();
        displayGoals();
    } else {
        console.log('user is NOT logged in');

        $('.masthead').show();
        $('.list-goals').hide();
        $('.garden').hide();
        $('.left-navbar').hide();
        $('#logoutBtn').hide();
        $('#signinBtn').show();
        $('#loginBtn').show();
        $('.create-goal').hide();

    }
};

function changeActiveNavbar() {
    $('body').on('click', '.left-navbar button', event => {
        console.log('navbar btn clicked');
        $('.left-navbar button').removeClass('navbar-active');
        $(event.currentTarget).addClass('navbar-active');
    })
}

function changeActiveGoals() {
    $('body').on('click', '.my-goals', event => {
        console.log('goal btn clicked');
        $('.my-goals').removeClass('goal-active');
        $(event.currentTarget).addClass('goal-active');
    })
}

function mygoalsBtnClick() {
    $('#mygoalsBtn').click(event => {
        clearScreen();
        $('.list-goals').show();
        $('.garden').show();
    })
};

function creategoalsBtnClick() {
    $('#creategoalsBtn').click(event => {
        clearScreen();
        $('.create-goal').show();
    })
};

function clearScreen() {
    $('.list-goals').hide();
    $('.garden').hide();
    $('.create-goal').hide();
};


function createGoal() {
    $('.create-goal').submit(event => {
        event.preventDefault();
        const goalTitle = $('input[name="goal"]').val();
        const goalStart = $('input[name="start-date"]').val();
        const goalEnd = $('input[name="end-date"]').val();

        console.log(goalTitle);
        console.log(goalStart);
        console.log(goalEnd);

        const newGoal = {
            name: goalTitle,
            startDate: goalStart,
            endDate: goalEnd,
            userId: localStorage.getItem("userId")
        }
        $('input[name="goal"]').val('');
        $('input[name="start-date"]').val('');
        $('input[name="end-date"]').val('');

        $.ajax({
            url: 'http://localhost:3232/goal/create',
            headers: { "authorization": localStorage.getItem('token') },
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(newGoal),
            success: function(data) {
                console.log(data);
                swal({
                    title: "Your goal was created!",

                    icon: "success"
                });
                $('.list-goals').append(`<div class="my-goals" value="${data.data.name}"><img class="seed" value="${data.data._id}" src="images/seedling.png"><p value="${data.data._id}">${data.data.name}</p></div>`);

            },
            error: function(error) {
                console.log(error);
            }
        });


        //TODO validate dates
        //TODO call the API
    })
};

function renderGoals(goals) {
    $('.list-goals').html(`<h2>My Goals:</h2>`);
    goals.forEach((goal) => {
        console.log(goal);
        $('.list-goals').append(`
                	
                	<div class="my-goals" value="${goal.name}">
                	<img class="seed" value="${goal._id}" src="images/seedling.png">
                	<p value="${goal._id}">${goal.name}</p>

                	</div>`);
    })

}

function displayGoals(isDemo) {
    if (isDemo) {
        renderGoals(demoAccount);
        $('.list-goals').on('click', '.my-goals', (event) => {
            $('.garden').show();
            $('html, body').animate({
                scrollTop: ($('.garden').offset().top)
            }, 500);
            
            $('.garden').html(`<h2>Enter actions:</h2>`);
            $('.garden').append(`<div>
                                <input type="text" class="new-action" name="action" placeholder="walked 20 minutes" required/>
                                <input type="hidden" class="hidden-id" name="id" value="${event.target.attributes.value.nodeValue}">
                             	<input type="submit" class="action-submit" name="submit" value="Submit action" disabled>
                             </div>`);
            let goal = demoAccount[0];
            console.log(goal);

            $('.garden').append(`<img class="action-seed" src="images/${images[goal.actions.length]}">`);
            $('.garden').append(`<p>Actions taken for</p> <h3>${goal.name}:</h3>`);
            $('.garden').append(`<div class="actions"></div>`);
            goal.actions.forEach(action => {

                $('.actions').append(`<p class="single-action">${action}</p>`);
            })
        })
    } else {
        console.log('displayGoals function was called');
        $('.list-goals').empty();
        $.ajax({
            url: 'http://localhost:3232/goal/all/' + localStorage.getItem('userId'),
            headers: { "authorization": localStorage.getItem('token') },
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
    }

};

function displaySelectedGoal() {

    $('.list-goals').on('click', '.my-goals', (event) => {
        $('.garden').show();
        $('html, body').animate({
            scrollTop: ($('.garden').offset().top)
        }, 500);
        $('.garden').html(`<div><input type="button" class="delete" value="Delete goal"></div>`);
        $('.garden').html(`<i class="fa fa-times fa-2x delete" aria-hidden="true" title="Delete goal"></i>`);
        $('.garden').append(`<h2>Enter actions:</h2>`);
        $('.garden').append(`<div>
                                <input type="text" class="new-action" name="action" placeholder="walked 20 minutes" required/>
                                <input type="hidden" class="hidden-id" name="id" value="${event.target.attributes.value.nodeValue}">
                             	<input type="submit" class="action-submit" name="submit" value="Submit action">
                             </div>`);
        //$('.garden').append(`<div><input type="submit" class="action-submit" name="submit" value="Submit action"></div>`);

        $.ajax({
            url: 'http://localhost:3232/goal/getbyid/' + event.target.attributes.value.nodeValue,
            headers: { "authorization": localStorage.getItem('token') },
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',

            success: function(result) {


                let goal = result.data;
                console.log(goal);

                $('.garden').append(`<img class="action-seed" src="images/${images[goal.actions.length]}">`);
                $('.garden').append(`<p>Actions taken for</p> <h3>${goal.name}:</h3>`);
                $('.garden').append(`<div class="actions"></div>`);
                goal.actions.forEach(action => {

                    $('.actions').append(`<p class="single-action">${action}</p>`);
                })
                /*
                if (goal.actions.length === 0) {
                    $('.garden').append(`<h3>${goal.name}</h3>`)
                    $('.garden').append(`<img class="action-seed" src="images/seed.png">`);
                } else if (goal.actions.length === 1) {

                    $('.garden').append(`<img class="action-seed" src="images/plant01.png">`);
                    $('.garden').append(`Actions taken for <h3>${goal.name}:</h3>`);
                    //$('.garden').append(`<div class="actions></div>`);
                    goal.actions.forEach(action => {
                        $('.garden').append(`<p>${action}</p>`);
                    })
                } else if (goal.actions.length === 2) {

                    $('.garden').append(`<img class="action-seed action-plant-2" src="images/flower.png">`);
                    $('.garden').append(`Actions taken for <h3>${goal.name}:</h3>`);
                    //$('.garden').append(`<div class="actions></div>`);
                    goal.actions.forEach(action => {
                        $('.garden').append(`<p>${action}</p>`);
                    })



                }*/
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
            url: 'http://localhost:3232/goal/addaction/' + $('.hidden-id').val(),
            headers: { "authorization": localStorage.getItem('token') },
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
                    $('.action-seed').attr('src', `images/${images[$('.single-action').length]}`);
                    $('.action-seed').removeClass('action-seed-shake');

                }, 1000)



            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    })
};

function deleteAction() {
    $('.garden').on('click', '.delete', (event) => {
        console.log('delete button clicked')

        swal({
            title: 'Are you sure you want to delete this goal?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            buttons: [true, "Yes, delete it!"],

        }).then((result) => {
            console.log(result);
            if (result == true) {
                $.ajax({
                    url: 'http://localhost:3232/goal/remove/' + $('.hidden-id').val(),
                    headers: { "authorization": localStorage.getItem('token') },
                    dataType: 'json',
                    type: 'delete',
                    contentType: 'application/json',

                    success: function(data) {
                        console.log(data);
                        $(event.target).parent().remove();
                        swal("Poof", "Goal was deleted!", "success");
                        $('.garden').html('');
                        displayGoals();
                    },
                    error: function(error) {
                        swal("Oh no!", "An error happened!", "error");
                    }
                });

            }
        })



    })
};

function logIn() {
    $('body').on('click', '.login-submit', (event) => {
        event.preventDefault();
        console.log('login submit btn clicked');
        $.ajax({
            url: 'http://localhost:3232/auth/login/',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                email: $('.email').val(),
                password: $('.password').val()
            }),

            success: function(data) {

                console.log(data);



                $('.email').val('');
                $('.password').val('');
                loginmodal.style.display = "none";
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("userId", data.data.userId);


                displayGoals();
                $('.masthead').hide();
                $('#loginBtn').hide();
                $('#logoutBtn').show();
                $('#signinBtn').hide();
                $('.list-goals').show();
                $('.garden').show();
                $('.left-navbar').show();
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    })
};

function logOut() {
    $('#logoutBtn').click(event => {
        localStorage.clear();
        $('.masthead').show();
        $('#logoutBtn').hide();
        $('#loginBtn').show();
        $('#signinBtn').show();
        $('.list-goals').hide();
        $('.garden').hide();
        $('.left-navbar').hide();
        $('.create-goal').hide();
    })
};

function signUp() {
    $('body').on('click', '.signup-submit', (event) => {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:3232/auth/register/',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('.signup-name').val(),
                email: $('.signup-email').val(),
                password: $('.signup-password').val()
            }),

            success: function(data) {
                console.log('signup submit btn clicked');
                console.log(data);
                swal("Yay!", "You're signed up!", "success");
                $('.signup-name').val('');
                $('.signup-email').val('');
                $('.signup-password').val('');
                signupmodal.style.display = "none";

            },
            error: function(error) {

                swal("Oh no!", error.responseJSON.message, "error");
            }
        });
    })
};

// Get the modal
const loginmodal = document.getElementById('loginModal');

// Get the button that opens the modal
const btn = document.getElementById("loginBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("login-close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    loginmodal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    loginmodal.style.display = "none";
};


// Get the modal
const signupmodal = document.getElementById('signupModal');

// Get the button that opens the modal
const signupbtn = document.getElementById("signinBtn");

// Get the <span> element that closes the modal
const signupspan = document.getElementsByClassName("signup-close")[0];

// When the user clicks on the button, open the modal 
signupbtn.onclick = function() {
    signupmodal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
signupspan.onclick = function() {
    signupmodal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == signupmodal || event.target == loginmodal) {
        signupmodal.style.display = "none";
        loginmodal.style.display = "none";
    }
};


function demoClick() {
    $('.demo').click(event => {
        console.log(demoAccount);
        displayGoals(true)
        $('.masthead').hide();

        $('.list-goals').show();
        $('.garden').show();
    })
}

$(demoClick);
$(checkUserLogin);
$(changeActiveNavbar);
$(changeActiveGoals);
$(creategoalsBtnClick);
$(mygoalsBtnClick);
$(signUp);
$(logIn);
$(logOut);

$(createGoal);
$(displaySelectedGoal);
$(submitAction);
$(deleteAction);