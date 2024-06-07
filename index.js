window.onload = function() {
    // Web uygulamanızın Firebase yapılandırması
    const firebaseConfig = {
        apiKey: "AIzaSyCshpssuJaHGDu_LpENSpTBUP9Z1K2wxEA",
        authDomain: "chatlink-beta-uygulamasi-1eac8.firebaseapp.com",
        projectId: "chatlink-beta-uygulamasi-1eac8",
        storageBucket: "chatlink-beta-uygulamasi-1eac8.appspot.com",
        messagingSenderId: "850198621231",
        appId: "1:850198621231:web:7d48a60b3f28320dd86ada",
        measurementId: "G-S5RM2EJGHQ"
    };

    // Firebase'i başlat
    firebase.initializeApp(firebaseConfig);
    // Bu çok ÖNEMLİ!! Çünkü "db" yi sık sık kullanacağız.
    var db = firebase.database();
    // Nesne Yönelimli Programlamayı kullanacağız. Lol
    class MEME_CHAT {
        // Home() ana sayfayı oluşturmak için kullanılır
        home() {
            // Başlık ve katılma formunu ekleme önce önce body'i temizle
            document.body.innerHTML = '';
            this.create_title();
            this.create_join_form();
        }
        // chat() sohbet sayfasını oluşturmak için kullanılır
        chat() {
            this.create_title();
            this.create_chat();
        }
        // Başlık oluşturmak için kullanılır
        create_title() {
            // Başlık oluşturucu.
            var title_container = document.createElement('div');
            title_container.setAttribute('id', 'title_container');
            var title_inner_container = document.createElement('div');
            title_inner_container.setAttribute('id', 'title_inner_container');

            var title = document.createElement('h1');
            title.setAttribute('id', 'title');
            title.textContent = 'ChatLink Beta Uygulaması';

            title_inner_container.append(title);
            title_container.append(title_inner_container);
            document.body.append(title_container);
        }
        // Katılma formu oluşturmak için kullanılır
        create_join_form() {
            // Parent = This olmalı. Veya olmasın. Ben senin patronun değilim! 
            var parent = this;

            var join_container = document.createElement('div');
            join_container.setAttribute('id', 'join_container');
            var join_inner_container = document.createElement('div');
            join_inner_container.setAttribute('id', 'join_inner_container');

            var join_button_container = document.createElement('div');
            join_button_container.setAttribute('id', 'join_button_container');

            var join_button = document.createElement('button');
            join_button.setAttribute('id', 'join_button');
            join_button.innerHTML = 'Katıl <i class="fas fa-sign-in-alt"></i>';

            var join_input_container = document.createElement('div');
            join_input_container.setAttribute('id', 'join_input_container');

            var join_input = document.createElement('input');
            join_input.setAttribute('id', 'join_input');
            join_input.setAttribute('maxlength', 15);
            join_input.placeholder = 'Adınız';
            // Her join_inputa yazı yazdığımızda
            join_input.onkeyup = function() {
                // Eğer girdimiz 0 harften uzunsa
                if (join_input.value.length > 0) {
                    // Butonu aktif hale getir
                    join_button.classList.add('enabled');
                    // Kullanıcıya butona tıklama izni ver
                    join_button.onclick = function() {
                        // İsmi yerel depoya kaydet. join_input değerini geçirerek
                        parent.save_name(join_input.value);
                        // join_container'ı kaldır. Bu sayede site garip görünmez.
                        join_container.remove();
                        // parent = this. Ama bu join_button değil
                        // Bu (MEME_CHAT = this).
                        parent.create_chat();
                    };
                } else {
                    // Eğer join_input boşsa butonu devre dışı bırak
                    join_button.classList.remove('enabled');
                }
            };

            // Her şeyi body'ye ekle
            join_button_container.append(join_button);
            join_input_container.append(join_input);
            join_inner_container.append(join_input_container, join_button_container);
            join_container.append(join_inner_container);
            document.body.append(join_container);
        }
        // Yükleme çemberi oluşturmak için kullanılır
        create_load(container_id) {
            // Parent = This de olmalı. Ama boşver. Senin için değil! 
            var parent = this;

            // Bu bir yükleme işlemi. Güzel bir şey.
            var container = document.getElementById(container_id);
            container.innerHTML = '';

            var loader_container = document.createElement('div');
            loader_container.setAttribute('class', 'loader_container');

            var loader = document.createElement('div');
            loader.setAttribute('class', 'loader');

            loader_container.append(loader);
            container.append(loader_container);
        }
        // Sohbet kutusunu oluşturmak için kullanılır
        create_chat() {
            // Tekrar! (parent = this) olmalı
            var parent = this;
            // MEMECHAT BAĞLANTISINI ALDIKMI ORADAN ÇIKAR
            var title_container = document.getElementById('title_container');
            var title = document.getElementById('title');
            title_container.classList.add('chat_title_container');
            // Başlığı daha küçük yaparak 'chat_title' yap
            title.classList.add('chat_title');

            var chat_container = document.createElement('div');
            chat_container.setAttribute('id', 'chat_container');

            var chat_inner_container = document.createElement('div');
            chat_inner_container.setAttribute('id', 'chat_inner_container');

            var chat_content_container = document.createElement('div');
            chat_content_container.setAttribute('id', 'chat_content_container');

            var chat_input_container = document.createElement('div');
            chat_input_container.setAttribute('id', 'chat_input_container');

            var chat_input_send = document.createElement('button');
            chat_input_send.setAttribute('id', 'chat_input_send');
            chat_input_send.setAttribute('disabled', true);
            chat_input_send.textContent = 'Gönder'; // "Gönder" yazısını ekledim
            chat_input_send.onclick = function() {
                // chat_input'in değeri boş değilse ve uzunluğu 0'dan büyükse
                if (chat_input.value.trim() !== '') {
                    // Mesaj gönderme işlevini çağır
                    parent.send_message(chat_input.value);
                    // chat_input değerini temizle
                    chat_input.value = '';
                    // chat_input'a odaklan
                    chat_input.focus();
                }
            };

            var chat_input = document.createElement('input');
            chat_input.setAttribute('id', 'chat_input');
            // Sadece en fazla 1000 karakterlik bir mesaj uzunluğu
            chat_input.setAttribute('maxlength', 1000);
            // Kullanıcının adını al
            chat_input.placeholder = `${parent.get_name()}. Bir Şeyler Yaz...`;
            chat_input.addEventListener('keyup', function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    chat_input_send.click();
                }
                if (chat_input.value.length > 0) {
                    chat_input_send.removeAttribute('disabled');
                    chat_input_send.classList.add('enabled');
                } else {
                    chat_input_send.classList.remove('enabled');
                }
            });

            var chat_logout_container = document.createElement('div');
            chat_logout_container.setAttribute('id', 'chat_logout_container');

            var chat_logout = document.createElement('button');
            chat_logout.setAttribute('id', 'chat_logout');
            chat_logout.textContent = `${parent.get_name()} Çıkış Yap`;
            // "Çıkış" aslında adı localStorage'dan silmek demek
            chat_logout.onclick = function() {
                localStorage.clear();
                // Ana sayfaya geri git
                parent.home();
            };

            chat_logout_container.append(chat_logout);
            chat_input_container.append(chat_input, chat_input_send);
            chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container);
            chat_container.append(chat_inner_container);
            document.body.append(chat_container);
            // Sohbeti oluşturduktan hemen sonra 'chat_content_container' içinde bir yükleme çemberi oluştur
            parent.create_load('chat_content_container');
            // sonra sohbet verilerini Firebase'den almak için "yenile"
            parent.refresh_chat();
        }
        // İsmi kaydeder. Harfi harfine localStorage'a kaydeder
        save_name(name) {
            // İsmi localStorage'a kaydet
            localStorage.setItem('name', name);
        }
        // Mesaj gönderir/mesajı firebase veritabanına kaydeder
        send_message(message) {
            var parent = this;
            // Eğer yerel depo adı null ise ve mesaj yoksa
            // o zaman geri dön/mesaj gönderme. Kullanıcı
            // bir şekilde mesaj göndermek için hackliyor gibi
            // gözüküyor. Ya da yerel deposunu kendisi sildi. Ama hackleme daha havalı görünüyor!!
            if (parent.get_name() == null && message == null) {
                return;
            }

            // Firebase veritabanı değerini al
            db.ref('chats/').once('value', function(message_object) {
                // Bu indeks önemlidir. Sohbeti düzenli bir şekilde düzenlemeye yardımcı olacak
                var index = parseFloat(message_object.numChildren()) + 1;
                db.ref('chats/' + `message_${index}`).set({
                    name: parent.get_name(),
                    message: message,
                    index: index,
                    // Mesajın gönderilme saatini al ve kaydet
                    time: new Date().toLocaleString() // Mesajın gönderildiği günü de ekledim
                }).then(function() {
                    // Sohbeti gönderdikten sonra yenile ve yeni mesajları al
                    parent.refresh_chat();
                });
            });
        }
        // İsmi alır. Kullanıcı adını localStorage'dan alır
        get_name() {
            // İsmi localStorage'dan al
            if (localStorage.getItem('name') != null) {
                return localStorage.getItem('name');
            } else {
                this.home();
                return null;
            }
        }
        // Sohbeti yeniler, mesaj/sohbet verilerini firebase'den alır
        refresh_chat() {
            var chat_content_container = document.getElementById('chat_content_container');

            // Firebase'den sohbetleri al
            db.ref('chats/').on('value', function(messages_object) {
                // Veriyi aldığımızda sohbet_content_container'ı temizle
                chat_content_container.innerHTML = '';
                // Eğer sohbette hiç mesaj yoksa. Hiçbir şey yükleme
                if (messages_object.numChildren() == 0) {
                    return;
                }

                // TAMAM! EĞER BİR YENİBİR KODLAYICIYSAN. BU ÇOK KOLAYMIŞ! SANIRIM. BELKİ DEĞİL. GÖRECEĞIZ!

                // Mesaj nesnesi değerlerini bir diziye dönüştür.
                var messages = Object.values(messages_object.val());
                var guide = []; // bu, mesajları düzenlememize yardımcı olacak rehberimiz olacak
                var unordered = []; // düzensiz mesajlar
                var ordered = []; // bu mesajları sıralayacağız

                for (var i, i = 0; i < messages.length; i++) {
                    // Rehber, basitçe 0'dan mesajların uzunluğuna kadar bir dizi
                    guide.push(i + 1);
                    // düzensiz, [mesaj, mesajın indeksi]
                    unordered.push([messages[i], messages[i].index]);
                }

                // Şimdi bu doğrudan stack overflow'dan 
                // Rehberin yardımıyla düzensiz mesajları sırala
                guide.forEach(function(key) {
                    var found = false;
                    unordered = unordered.filter(function(item) {
                        if (!found && item[1] == key) {
                            // Düzenli mesajları ordered dizisine itin
                            ordered.push(item[0]);
                            found = true;
                            return false;
                        } else {
                            return true;
                        }
                    });
                });

                // Artık bitti. Sadece sıralı mesajları göster
                ordered.forEach(function(data) {
                    var name = data.name;
                    var message = data.message;
                    // Gönderilme saatini al
                    var time = data.time;
                        
                    var message_container = document.createElement('div');
                    message_container.setAttribute('class', 'message_container');

                    var message_inner_container = document.createElement('div');
                    message_inner_container.setAttribute('class', 'message_inner_container');

                    var message_user_container = document.createElement('div');
                    message_user_container.setAttribute('class', 'message_user_container');

                    var message_user = document.createElement('p');
                    message_user.setAttribute('class', 'message_user');
                    message_user.textContent = `${name} - ${time}`; // Kullanıcı adı ve gönderilme saati

                    var message_content_container = document.createElement('div');
                    message_content_container.setAttribute('class', 'message_content_container');

                    var message_content = document.createElement('p');
                    message_content.setAttribute('class', 'message_content');
                    message_content.textContent = `${message}`;

                    message_user_container.append(message_user);
                    message_content_container.append(message_content);
                    message_inner_container.append(message_user_container, message_content_container);
                    message_container.append(message_inner_container);

                    chat_content_container.append(message_container);
                });
                // Container'ın altındaki en son mesaja git
                chat_content_container.scrollTop = chat_content_container.scrollHeight;
            });
        }
    }
    // Uygulamamızı "oluşturduk". Şimdi çalıştıralım!!
    var app = new MEME_CHAT();
    // Eğer localStorage'da bir isim varsa.
    // O zaman bu ismi kullan. Aksi takdirde, değilse.
    // Anasayfaya git
    if (app.get_name() != null) {
        app.chat();
    }
};
