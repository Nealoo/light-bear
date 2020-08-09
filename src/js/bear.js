import '../scss/home.scss';

// import report from './report'

import { getLoginStatus, setLoginStatus, clearLoginStatus, getUserInfo, setUserInfo} from './utils/tools';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Chart from 'chart.js';

export default function(){
    // report();

    // bear logic start

    const $loginContainer = $('#login_container');
    const $bodyContainer  = $('#bear_body_container');

    const apiURL = 'http://127.0.0.1:5000/'
    // const apiURL = 'http://api.mrkpi.icu/'

    // setLoginStatus();
    // clearLoginStatus();

    initLoginSection();
    initPageByData();
    bindLogin();
    bindWeightSetAction();
    bindGetGift();
    bindSetGift();
    bindGiftDeleteAction();

    bearLogoUpdate();

    $('#logout_button').on('click', function(){
        clearLoginStatus();
    });

    function bearLogoUpdate(){
        const imageList = [
            'https://friendlystock.com/wp-content/uploads/2019/10/7-fat-bear-cartoon-clipart.jpg',
            'https://i.etsystatic.com/19837560/r/il/0863b5/1822441262/il_794xN.1822441262_rs15.jpg',
            'https://thumbs.dreamstime.com/b/bear-grizzly-big-head-looking-honey-bee-insect-cute-cartoon-character-forest-baby-animal-collection-blue-sky-background-78403422.jpg',
            'https://thumbs.dreamstime.com/b/cartoon-grizzly-bear-animal-character-vector-illustration-112047435.jpg',
            'https://thumbs.dreamstime.com/b/cartoon-bear-badge-25420965.jpg',
            'https://thumbs.dreamstime.com/b/cartoon-vector-illustration-brown-grizzly-bear-isolated-white-background-teddy-fries-marshmallow-bonfire-cartoon-brown-126243268.jpg',
            'https://thumbs.dreamstime.com/b/big-brown-grizzly-bear-cartoon-style-blue-background-illustration-79031181.jpg',
            'https://thumbs.dreamstime.com/b/funny-cartoon-cute-bear-illustration-vector-brown-grizzly-68279680.jpg',
            'https://thumbs.dreamstime.com/b/colorful-vector-illustration-cartoon-bear-cartoon-vector-bear-122711752.jpg',
            'https://www.kindpng.com/picc/m/212-2120939_brown-cliparts-png-teddy-bear-cartoon-teddy-bear.png',
            'https://image.freepik.com/free-vector/bear-cartoon-hand-drawn-style_42349-467.jpg',
            'https://i7.pngguru.com/preview/721/554/483/bear-wedding-invitation-baby-shower-party-clip-art-teddy-bear.jpg',
            'https://img.favpng.com/15/11/9/grizzly-bear-baby-grizzly-giant-panda-cartoon-network-png-favpng-HaNxmwyXAL5hv31zSHh0qHK3t.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS1c9SFaWjn2JjyAR1rO_zqoC0j34bqYJ9pcA&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRc7Yo0RPZBUjo-ZtAW8v-iVIN2HmJGlBRZSQ&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKE_QqAWkM-joBwUyVB2R_fyU0pLEGxhW9QQ&usqp=CAU',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQis6aCRqqmJmnSxtZmdhWV3KyIDu3RC5YEBg&usqp=CAU'
        ]

        setTimeout(()=>{
            $('.bear-logo').prop('src', imageList[Math.floor(Math.random() * imageList.length)]);
        }, Math.random() * 10000);
    }

    function initLoginSection(){
        if( getLoginStatus() == 'true' ){
            $loginContainer.hide();
            $bodyContainer.show();
        }else{
            $loginContainer.show();
            $bodyContainer.hide();
        }
    }

    function bindLogin(){
        $('#login_button').on('click', ()=>{
            const userName = $('#user_name').val();
            const key      = $('#user_key').val();

            checkLogin(userName, key);            
        });
    }

    function checkLogin(userName, key){
        $.ajax({
            method: 'PATCH',
            url: apiURL + 'bear-weight/',
            data: { userName, key }
        }).done(function( res, textStatus, xhr ) {
            if( res ){
                setLoginStatus();
                setUserInfo(userName, key);
                initPageByData();
                initLoginSection();
            }else{
                Swal.fire('Oops...', 'Login details are wrong', 'error');
                clearLoginStatus();
            }
        });
    }

    function initPageByData(){

        $.ajax({
            method: 'GET',
            url: apiURL + 'bear-weight/',
            data: getUserInfo()
        }).done(function( res, textStatus, xhr ) {
            if( res ){

                if(xhr.status == 200){

                    $('#bear_body_container .spinner-inner').removeClass('d-none');
                    $('.spinner-border').remove();

                    $('#bear_weight').val(res.response.currentWeight);

                    if(res.response.currentMeal){
                        $('#bear_skip_breakfast').prop('checked', res.response.currentMeal[0]=='true');
                        $('#bear_skip_lunch').prop('checked', res.response.currentMeal[1]=='true');
                        $('#bear_skip_dinner').prop('checked', res.response.currentMeal[2]=='true');
                    }
                    
                    if(res.response.currentNote){
                        $('#bear_note_breakfast').val(res.response.currentNote[0]);
                        $('#bear_note_lunch').val(res.response.currentNote[1]);
                        $('#bear_note_dinner').val(res.response.currentNote[2]);
                    }
                    
                    if(res.response.currentCalorie){
                        $('#bear_calorie_breakfast').val(res.response.currentCalorie[0]);
                        $('#bear_calorie_lunch').val(res.response.currentCalorie[1]);
                        $('#bear_calorie_dinner').val(res.response.currentCalorie[2]);
                    }
                    initLineChart(Object.keys(res.response.weightRecord), Object.values(res.response.weightRecord));
                }else{
                    Swal.fire('Oops...', JSON.stringify(res), 'error');
                }
                

            }else{
                Swal.fire('Oops...', 'Login details are wrong', 'error');
                clearLoginStatus();
                initLoginSection();
            }
        });
    }

    function bindWeightSetAction(){
        
        $('#bear_set_weight').on('click', ()=>{
            const bearWeight        = $('#bear_weight').val();

            const bearSkipBreakfast = $('#bear_skip_breakfast').is(':checked');
            const bearSkipLunch     = $('#bear_skip_lunch').is(':checked');
            const bearSkipDinner    = $('#bear_skip_dinner').is(':checked');

            const bearNoteBreakfast = $('#bear_note_breakfast').val();
            const bearNoteLunch     = $('#bear_note_lunch').val();
            const bearNoteDinner    = $('#bear_note_dinner').val();

            const calorieBreakfast  = $('#bear_calorie_breakfast').val();
            const calorieLunch      = $('#bear_calorie_lunch').val();
            const calorieDinner     = $('#bear_calorie_dinner').val();

            const requestData = {
                'weight': bearWeight,
                'mealRecord': [bearSkipBreakfast,bearSkipLunch,bearSkipDinner].join('|||'),
                'mealNote': [bearNoteBreakfast,bearNoteLunch,bearNoteDinner].join('|||'),
                'calorieRecord': [calorieBreakfast,calorieLunch,calorieDinner].join('|||')
            }

            console.log(requestData);

            $.ajax({
                method: 'POST',
                url: apiURL + 'bear-weight/',
                data: Object.assign(requestData, getUserInfo())
            }).done(function( res, textStatus, xhr ) {
                if( res ){
                    console.log(res);
                    Swal.fire('OK', res, 'success');
                }else{
                    if(xhr.status == 401){
                        Swal.fire('Oops...', 'Login details are wrong', 'error');
                        clearLoginStatus();
                        initLoginSection();
                    }else{
                        Swal.fire('Oops...', res, 'error');
                    }
                    
                }
            });

        })
    }

    function bindSetGift(){

        $('#bear_set_gift').on('click', ()=>{
            const giftName  = $('#bear_gift_name').val();
            const giftPrice = $('#bear_gift_price').val();
            const giftNote = $('#bear_gift_note').val();

            const requestData = {
                'giftName': giftName,
                'giftPrice': giftPrice,
                'giftNote': giftNote
            }

            console.log(requestData);

            if(!giftName || !giftPrice){
                Swal.fire('XX', 'name or price can\'t be null', 'error');
                return false;
            }

            $.ajax({
                method: 'POST',
                url: apiURL + 'bear-gift/',
                data: Object.assign(requestData, getUserInfo())
            }).done(function( res, textStatus, xhr ) {
                if( res ){
                    console.log(res);
                    Swal.fire('OK', res, 'success');
                    $('#bear_get_gift').click();
                }else{
                    if(xhr.status == 401){
                        Swal.fire('Oops...', 'Login details are wrong', 'error');
                        clearLoginStatus();
                        initLoginSection();
                    }else{
                        Swal.fire('Oops...', res, 'error');
                    }
                    
                }
            });
        });
        
    }

    function bindGetGift(){

        $('#bear_get_gift').on('click', ()=>{
            $.ajax({
                method: 'GET',
                url: apiURL + 'bear-gift/',
                data: getUserInfo()
            }).done(function( res, textStatus, xhr ) {
                if( res ){
                    console.log(res);

                    $('#bear_gift_tbody').html(tableRowTemplate(res.response));
                }else{
                    if(xhr.status == 401){
                        Swal.fire('Oops...', 'Login details are wrong', 'error');
                        clearLoginStatus();
                        initLoginSection();
                    }else{
                        Swal.fire('Oops...', res, 'error');
                    }
                    
                }
            });
        });

        
    }

    function bindGiftDeleteAction(){
        $('#bear_gift_table').on('click', '.gift-delete-action', (e)=>{

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {

                console.log(result);
                if(result.value){
                    $.ajax({
                        method: 'DELETE',
                        url: apiURL + 'bear-gift/',
                        data: Object.assign(getUserInfo(), {'uuid': $(e.target).data('id')})
                    }).done(function( res, textStatus, xhr ) {
                        if( res ){
                            $(e.target).parent().remove();
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                        }else{
                            if(xhr.status == 401){
                                Swal.fire('Oops...', 'Login details are wrong', 'error');
                                clearLoginStatus();
                                initLoginSection();
                            }else{
                                Swal.fire('Oops...', res, 'error');
                            }
                            
                        }
                    });
                }

                
            });
        });
    }

    function tableRowTemplate(data){
        return `
            ${Object.keys(data).map((id, index)=>{
                const giftName = data[id].name;
                const giftPrice = data[id].price;
                const giftNote  = data[id].note || '';
                return `
                    <tr>
                        <th>${index+1}</th>
                        <th>${giftName}</th>
                        <td>${giftPrice}</td>
                        <td>${giftNote}</td>
                        <td class="gift-delete-action" data-id=${id}>delete</td>
                    </tr> 
                `
            }).join('')}
        `
    }
    
    function initLineChart(dates, weights){
        let ctx = document.getElementById('bear_weight_chart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data:{
                
                datasets:[{
                    label: 'test',
                    data: weights,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                }],
                labels: dates
            }
            
        });
    }

    // bear logic end
    
}