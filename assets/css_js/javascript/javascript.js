// render UI 1-5
// load current song into thumb  8 - 12 
// btn play pause 13-16
// progress of song 17 18 
// next song  19 20   prev 21 22   random 23 - 26  

// handle next song when end  27 28
// handle repeat song when end   29
// next song render again 30-32 css 33 
// 34 35 scroll active song into view (get class have song active pull/drag it to view)
// 36 click to the playlist 


export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

const playlist = $('.contain_songs')
// const thumb = $('.thumb')
const thumbpic = $('.thumbpic')
const nameSong = $('.title')
const nameSinger = $('.author')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const container = $('.container')
const progress = $('#progress')
const btnRepeat = $('.btn-repeat')
const btnPrev = $('.btn-prev')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')
const minus = $('.minus-text')
const PLAYER_STORAGE_KEY = "[F8_PLAYER]" 



 
import {Mixplaylist} from '/assets/css_js/javascript/mix.js';
const songsPlaylist = Mixplaylist;



const app = {
    songs:songsPlaylist, //0
    currentIndex: 0, //9
    isPlaying: false, //14
    isRandom : false, //23
    isRepeat : false,//28
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, //47
            setConfig: function(key,value){//49
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
    //2 render UI
    render: function(){
        //4 toward each array to get song and render into html
        const htmls = this.songs.map((song,index )=> { //30 add index//31 add ${index===}
            return`          
                <div class="Songs ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="pics" style="background-image: url('${song.image}')"></div>   
                    <div class="bodys">
                        <h3 class="titles">${song.name}</h3>
                        <p class="authors">${song.singer}</p>
                    </div>      
                    <span class="minus-text" >minus</span>       
                </div>           
            `
        })
        //5 take out playlist of song
        playlist.innerHTML = htmls.join('')
    },


    //6 handle event function
    handleEvents: function(){
        const _this = this
        
        //13 handle when click play 
        playBtn.onclick = function(){
            if(_this.isPlaying){ //14 isPlaying: false->pause
                audio.pause()
            }else{
                audio.play()
            }
        }
        //15 when song played
        audio.onplay = function() {
            _this.isPlaying = true 
            container.classList.add('playing')
            // audio.play()
        }
        //16 when song paused
        audio.onpause = function() {
            _this.isPlaying = false 
            container.classList.remove('playing')

        }
        //17 progress of song change 
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/ audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //18 handle when rewind song 
        progress.onchange = function(e) { // change through user ui
           // console.log(e.target.value) // take our value when you rewind 
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime
        }
        //19 when next song 
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong() //26 press random and next song is
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()//32
            _this.scrollToActiveSong()//35

        }
        //21 when prev song 
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong() //26
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()//32
            _this.scrollToActiveSong()//35
        }
        //24 on off random
        btnRandom.onclick = function(e){
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom)
        }
        //27 handle next song when audio end
        audio.onended = function(){
            // console.log(1234)
            if(_this.isRepeat){
                audio.play()
            }else{
                btnNext.click()
                //song end ->> next song 
            }
        }
        //29 handle repeat song when end 
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active',_this.isRepeat)
        }



        //36  listen action click into playlist
        // main: when you click into a box (except option )-> have to change song 
        playlist.onclick = function(e){
            //check console.log(e.target)// e is event , target is point you click |show elemet you clicked
            //closest  return its parent or its self // if can't find element return null 
            const songNode = e.target.closest('.Songs:not(.active)')
            if(songNode || e.target.closest('.minus-text')) {// find song have't active  or not a option
                //console.log(e.target)//check 
                //change song you have to get index of it 
                //44 transmisstion in to song ->44+1

                //46 handle click into song
                if(songNode ){
                    //c1 console.log(songNode.getAttribute('data-index')) //take out index number
                    //console.log(songNode.dataset.index)//c2 ||//take out index number
                    _this.currentIndex = Number(songNode.dataset.index) //()-> string -> convert to Numver
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    //
                }
                // handle click into song option
                if(e.target.closest('.option')){

                }
            }
                
        }

    },


    
    //8 function define Object
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    //11 function load current song 
    loadCurrentSong: function(){
        thumbpic.style.backgroundImage = `url('${this.currentSong.image}')`
        nameSong.textContent = this.currentSong.name
        nameSinger.textContent = this.currentSong.singer
        audio.src = this.currentSong.path
        $('.picsb').style.backgroundImage = `url('${this.currentSong.image}')`
        $('.authorsb').textContent = this.currentSong.name
        $('.titlesb').textContent = this.currentSong.singer
        // console.log(thumbpic,nameSong,nameSinger,audio)
    },
    //20 function next song 
    nextSong: function(){
        this.currentIndex++ // increase song
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong() // call above to load current song 
        
    },
    //22 function prev Song
    prevSong: function(){
        this.currentIndex-- //decrease
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong() // load current song of prev
        
    },
    //25 function random song
    playRandomSong: function(){ //dont clude current song
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        console.log(newIndex)
        this.loadCurrentSong()
    },

    //34//show the active song on your view 
    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.Songs.active').scrollIntoView({
                behavior : 'smooth',
                block: 'center'
            })
        },200)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },





    





    //1 method start to begin
    start: function(){
        this.loadConfig()
        btnRandom.classList.toggle('active',this.israndom)
        btnRepeat.classList.toggle('active',this.isRepeat)
        this.render() //3 call function render playlist
        this.handleEvents()//7 listen and resold event
        this.defineProperties()//10
        this.loadCurrentSong()//12
       
    }
}

//1.1 app access into start
app.start()