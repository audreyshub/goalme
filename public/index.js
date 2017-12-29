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
            headers: {"authorization": localStorage.getItem('token')},
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

function displayGoals() {
    console.log('displayGoals function was called');
    $('.list-goals').empty();
    $.ajax({
        url: 'http://localhost:3232/goal/all/' + localStorage.getItem("userId"),
        headers: {"authorization": localStorage.getItem('token')},
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',

        success: function(data) {

            data.data.forEach((goal) => {
                console.log(goal);
                $('.list-goals').append(`
                	<div class="my-goals" value="${goal.name}">
                	<img class="seed" value="${goal._id}" src="images/seedling.png">
                	<p value="${goal._id}">${goal.name}</p>

                	</div>`);
            })

        },
        error: function(error) {
            console.log(error);
        }
    });
};

function displaySelectedGoal() {
    $('.list-goals').on('click', '.my-goals', (event) => {
        $('html, body').animate({
            scrollTop: ($('.garden').offset().top)
        }, 500);
        $('.garden').html(`<div><input type="button" class="delete" value="Delete goal"></div>`);
        $('.garden').append(`<h2>Enter actions:</h2>`);
        $('.garden').append(`<div><input type="text" class="new-action" name="action" placeholder="walked 20 minutes" required/></div>`);
        console.log(event.target.attributes.value.nodeValue);
        $('.garden').append(`<div><input type="hidden" class="hidden-id" name="id" value="${event.target.attributes.value.nodeValue}"></div>`);

        $('.garden').append(`<div><input type="submit" class="action-submit" name="submit" value="Submit"></div>`);

        $.ajax({
            url: 'http://localhost:3232/goal/getbyid/' + event.target.attributes.value.nodeValue,
            headers: {"authorization": localStorage.getItem('token')},
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',

            success: function(result) {


                let goal = result.data;
                console.log(goal);

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



                }
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
            headers: {"authorization": localStorage.getItem('token')},
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ action: $('.new-action').val() }),

            success: function(data) {
                console.log(data);
                let action = $('.new-action').val();
                $('.garden').append(`<p>${action}</p>`);
                $('.new-action').val('');
                $('.action-seed').addClass('action-seed-shake');


                setTimeout(() => {
                    $('.action-seed').attr('src', "images/plant01.png");
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
        $.ajax({
            url: 'http://localhost:3232/goal/remove/' + $('.hidden-id').val(),
            headers: {"authorization": localStorage.getItem('token')},
            dataType: 'json',
            type: 'delete',
            contentType: 'application/json',

            success: function(data) {
                console.log(data);
                $(event.target).parent().remove();
                swal("Poof", "Goal was deleted!", "success");
                $('.garden').html(`<h2>Nothing to see here :)</h2>`);
                displayGoals();
                //$('.list-goals').remove(`<div class="my-goals" value="${data.data.name}"><img class="seed" value="${data.data._id}" src="images/seedling.png"><p value="${data.data._id}">${data.data.name}</p></div>`);
                //$('.list-goals').remove(data.data._id);
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });

    })
};


function logIn() {
    $('.navbar').on('click', '.login-submit', (event) => {
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
                console.log('login submit btn clicked');
                console.log(data);
                swal("Yay!", "You're in!", "success");
                $('.email').val('');
                $('.password').val('');
                modal.style.display = "none";
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("userId", data.data.userId);
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    })
}

function logOut() {
	$('#logoutBtn').click(event => {
		localStorage.clear();
	})
}

function signUp() {
    $('.navbar').on('click', '.signup-submit', (event) => {
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
                modal.style.display = "none";
                
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    })
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("loginBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var signupmodal = document.getElementById('signupModal');

// Get the button that opens the modal
var signupbtn = document.getElementById("signinBtn");

// Get the <span> element that closes the modal
var signupspan = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
signupbtn.onclick = function() {
    signupmodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
signupspan.onclick = function() {
    signupmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == signupmodal) {
        signupmodal.style.display = "none";
    }
}


$(signUp);
$(logIn);
$(logOut);
$(displayGoals);
$(createGoal);
$(displaySelectedGoal);
$(submitAction);
$(deleteAction);