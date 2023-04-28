using Dublongold_site.Models;

namespace Dublongold_site.Useful_classes
{
    /// <summary>
    /// Призначений для створення початкових даних в базі даних.
    /// На даний момент, створює 3 статті, 8 коментарів та 2-е користувачів. Пароль кожного з них, якщо що, - 123.
    /// </summary>
    public static class Create_start_data_of_database
    {
        public static void Create()
        {
            using (Database_context db_context = new())
            {
                db_context.Database.EnsureDeleted();
                db_context.Database.EnsureCreated();
                List<Article> articles = new()
                {
                    new Article{
                        Id = 1, Theme = "Theme 1",
                        Tags = "programming", Description = "But who is the clinical bureau, that is made great",
                        Content = "But who is the clinical bureau, that is made great. " +
                        "<br/><img src='/Images/1/1.jpg'><br/>" +
                        "There is no such thing in my property, but the fermentation bed, just the property. " +
                        "There is no sorrowful hatred, but we must drink, and we fear the wrath of God. Now, however, I am advocating and exclaiming. There is no such thing as a soft one. Mauris et odio vulputate libero tincidunt placerat vel vel risus. And when the orcs are born, the mountains will give birth to feathers and great arrows, and a ridiculous mouse will be born. It's just that I don't invest my money. Live the mass of poison and the course of laying the bow. A very easy start to the investment policy. Tomorrow, layer upon layer of chocolate. Mauris iaculis iaculis mauris, id ultrices tortor auctor a. Leave the yeast for a while, sometimes leave the dough with the sauce.\r\n\r\nCurabitur of life. But the author of the web, not the mourners for that. There is no free agency before him, who should be just a scepter of Euismod. As he was targeted with hatred, the eleifend did not fall into the valley. Each of them has a financial investment, and a smile on the face of concern. Until now and then the rain, and the easy bow. Even Rhonus Laoreet mourns. I always have a pillow from that. For the purpose of mass production, they are not aimed at anything other than the dignissim of life. The children of the porta mauris need the earth layer and the course of the bed always. Aenean, who wants a diamond?\r\n\r\nBut hate the bow, let's put a lot of diam in, except the pillow. As Lacinia, as the port of eu consecution, the bed of the mauris is sometimes the land, the eu consecution of the arc of the orci but the land. Until it is not necessary before, eu feugiat mauris. No euismod convallis urn, no dignissim sem gravida ut. It should not be a complete lake. Fusce pill of life from and poison. But as hendrerit nisl, that's a lot of money. We live at home.\r\n\r\nUntil the end of my life. It is an element of the entrance gate. There is nothing more interesting than the life of Euismod. But it flatters the tortor or tortor mattis ullamcorper. I don't care about my basketball sometimes, I don't just decorate the pillow. Curabitur pulvinar lake. It's a development project, but it's a philanthropic family. He is pregnant before the football bed. In fact, the author flatters that the airline bed is a lot of fun. There is no such thing as a mass of teenagers. The class is suitable for the silent partners who turn to the shores through our marriages, through the Hymenaean projects.\r\n\r\nAeneas was not targeted by hate, but the author of football. The ship was before him, the tincidunt in diam a, the pulvinar luctus tellus. For a large batch of rice, it is convenient not even now, but the pot is made with care. The fleet is accomplished, the ligula in the feugiat lobortis, for the dui has no investment, for the life of the lacinia is only a torturer like him. Some of the students are smart, employees from the workshop, and the students in the school. He was full of eros and just had a yeast infection in his throat, but his throat was sore. Maecenas Lake Leo, leaven from the proteins of life, members but how. It's a little bit sad, but neither is the mass of protein running. It is not necessary to put the hendrerit on the pellentesque lobortis nibh. Maecenas said to the dui either from the result, or the Lacinia ligula hendrerit. I have no laughter, vehicles need mourning football, said the fans. Even if there is no propaganda, the element of the element of the enemy is that, the violence against the players. Each cartoon has its own boundaries. The vestibule at lake and not the vestibule need.\r\n\r\nBut let's go home, my sad life, the very ugly pregnant wisdom, that land of the earth is free of dignissim. Not even the biggest salad. Someone just needs to do their homework. Aenean in the first layer of laughter Some real estate is not worth the price. The airline flatters the members. Maecenas flatters who laughs as an author. There is no complete ultrice eros, a soft bed needs mourning. At the time of the clinical trial, at the time of the development of the disease, there was a great need for the time of life. The whole process is pure and simple. He is responsible for the football department. For dignissim hate the world, nor the valley should be rhoncus. Integer or elit tincidunt, the biggest no in, sad mass.\r\n\r\nBut who should drink from the lake? No one is sad either. Now I'm looking forward to investing in football. But football is more clinical. Curabitur vitae ipsum sagittis, aculis pain consecut, hendrerit fear. Even the course of the pharetra and the laoreet accumsan. Some of the dignissim before. The children hate the people, they don't have the poison, they don't like the lake, the biggest free bird. Let's live on the property, let's talk about what's convenient, but what's important is that it's the most important thing, the time of mourning for the bed in which. It's important to be a basketball player. Now that life itself is the beginning of pregnancy. Until sometimes, for as an ecological vestibule, the biggest part of the world, and the trigger element of the world. He is said to have lived in this street. Children were said to be pained by bows, and not poisoned by arrows. There is nothing easy. Now life is always a smile."
                    },
                    new Article{Id = 2, Theme = "Theme 2", Description = "Chat as my therapist. I would like to spend the rest of my life, as well as to set up the vestibule, my various pools, as arrows, but now",
                        Content = "Chat as my therapist. I would like to spend the rest of my life, as well as to set up the vestibule, my various pools, as arrows, but now. It's not a salad and a recipe to decorate, it's always someone's favorite. Until the time of laughter, what is the time of feugia. But it was to be adorned, but with the limits of laughter, it is dignified. It should be drunk at the end of the day. The disease must be a cartoon of some sort. Tomorrow's announcement of the players, the easy ones or the lake in, the sauce is said to trigger. Morbi is sad, it is necessary to take dignissim, just as Leo Lacinia, but the greatest lake is to promote the amet diam. For he does not have to pay for the basketball, and he does not need a gate except for the basketball. No need for free pure.\r\n\r\nThe entire career, but the vestibule time, the eros orci dignissim tortor, life was not the vestibule of the hospital. For my wisdom, and the laoreet, the players will pursue it. It was a weekend. Aenean, but pure in no way, is sometimes soft and not free. Now feugiat, urn or easy arrows, wisdom pure cursus sapien, eu consequat mauris turpis or just. For time is the need for the ends of the universe. Integer felis elit, imperdiet but laugh it, laoreet to adorn the pain. Laughter is made of two things. The entire time of the shooting of the arrows, there was no shooting of the arrows. People are not local, people are different from people, tincidunt at lorem. To-morrow the ullamcorper to my property.\r\n\r\nMorbi a dolor varius, laoreet libero vitae, rhoncus dui. As expected before. Aeneas did not know that. With two targets, the football field is made, the fear itself is a caricature, not a trigger for the propaganda of life's evils. Curabitur ligula libero, consectetur nor laoreet a, aliquet finbus ipsum. As a weekend, except for that period of time. Everyone needs a lot of time and money to watch or advertise. Now there is no door to the earth. It's a eu arc at a free semper ullamcorper tincidunt id ex. Mauris Hendrerit wants time and does not always prepare. As always, the gatekeeper was sad and sad. In the pursuit of the bed. As the element of laughter, it follows that it is pure. A soft boat should be decked out in front, it needs a comfortable smile. Sometimes hunger is expected and before it is the first thing in the throat. Even if it's an arc, it's good to be a real estate agent, no matter who the developer is.\r\n\r\nTomorrow, however, I just need a clinical trial. Until the trucks are cheap, and the chocolate is great. We want to live life with easy arrows. For the purpose of the arc, it takes time for the weekend, the pain of the rutrum hendrerit. Until now, fringilla or orci that, fringilla vulputate sapien. It's as good as it gets. The course of the course of the life of the football players. Maecenas and homework Duis condimentum sollicitudinum tellus, vitae feugiat mauris pharetra ut The end of the life of the children hate vulputate. I would like to talk about my vestibule or a large property, but in the fringilla it is not a property. Until it is time to invest in a wise way. Maecenas wants eros, an element such as wisdom, some policy. Maurice was pure. It's important to focus on mass vehicles, not on the basis of euismod. No makeup for me.\r\n\r\nTo-morrow, and if not just, I expect to put it. There is nothing easy. Aenean needs a free, free-flowing element such as basketball. As the mass of the valley, the mass of the mass and time, it had to be drunk. Home cartoons are a must-see, but basketball is homework. The casino is not for some. We live in a hospital, but the football is great, the biggest soft diam. Some football vehicles. Suspendisse porttitor id leo at ultricies. There is no mass of any vehicle that is responsible for medical care. Even the ullamcorper tincidunt turpis, or the bottle of arc sauce neither. Each life is not an urn vehicle of feugiat as there is no one. Until then, it is not a big deal for the kids. I had some fear of the future, that's what I expected.\r\n\r\nNow you can easily shoot from the vehicles of the valley. Therefore, the author of the Hendrerit dui, or the so-called arch of the throat needs. Tomorrow, however, the story is told, there are no vehicles in it, the schools are easy. There is always no need for any kind of freight. Tomorrow, sometimes I have to put the asset. In fact, it is very flattering to developers. As sometimes members of the same, or chocolate clinical developers or. Mauris fringilla euismod except and mattis. He was at home, sometimes there was no one, the price of the product was time. But a different price will follow. Tomorrow the members of the throat want, not the developers no financing. Tomorrow, not vulputate nor neque, but a quiver. It's on the internet mass. Mauris dignissim, dui pretium tincidunt feugiat, lacus mauris hendrerit justo, not some one nor any wise one. Sometimes hunger is expected and before it is the first thing in the throat. Curabitur nor great that dui convallis pellentesque."
                    }
                };
                for(int i = 3; i < 50; i++)
                {
                    articles.Add(new Article
                    {
                        Id = i,
                        Theme = $"Theme {i}",
                        Tags = "programming",
                        Description = "Until the casino or salad needs time. But as well as dignissim turpis",
                        Content = "Until the casino or salad needs time. But as well as dignissim turpis. No flattery except before, eu eleifend is a weekend. No one hates the earth. Even if the players or my dignissim feugiat a nec ipsum. It's important to set up a website that has a lot of fun. Therefore, there is no quiver from the valley, fear flatters hate, but time fear does not need fear. It was a weekend. Aenean needs no element of my chocolate drink. It also takes a low price and does not make it easy. He does not care, he does not care, he does not care, he has a soft throat. Mauris at will vulputate, ullamcorper ex eget, great fermentum. There are no easy limits to time. Neither the land nor the land is important for children. Suspendisse ultricies than one who frees ultricies, nor the gate.\r\n\r\nProin pellentesque. As an author, my quis tincidunt aliquam, risus tortor luctus odio, sus suscepti just mauris in bed. Sometimes hunger is expected and before it is the first thing in the throat. He is said to have lived in this street. Until the cartoon is pure lake, so that it becomes a mauris luctus eu. The casino is made live. Aeneas is a different author than, and an element of diam vestibulum id. No one wants to.\r\n\r\nAeneas or a bed, but the ligula should be drunk with a quiver. Mauris is pregnant at leo laoreet, and pellentesque before malesuada. Chat as an employee. Everyone needs my homework. Until he wants to be a doctor. But the cartoon porta laoreet. But once again the fear of putting football as targets. I do not give any leaven members, as hendrerit sem lacinia id. The cartoons of the players of the lake, the gate of basketball itself and For the vestibule of the valley is convenient.\r\n\r\nMauris ultricies, for he does not take advantage, for he is shot with arrows, eu eleifend is now ugly and not himself. But it's a lot of time to do homework like that. But the airports as a developer of time, football developers the element of pain. No performance monitor. Everyone is either a eros eleifend sometimes. There is nothing easy. A large number of variables called Euismod. As a basketball player, that flatters the need. Until a fear that sometimes needs to be expected as ex. Now let's take a look at the cost factor. Tomorrow members, just and soft pregnancy, just ligula faucibus lorem, but hendrerit lorem nibh not before. For eros neque, vulputate at mollis et, mattis in justo. Aeneas did not even decorate the gate. Complete with just laughter. Mauris always hates the quiver, who knows how to invest money.\r\n\r\nSuspendissement sauce, it was vulputate jaculis, tellus eros pulvinar lorem, the leaven of life free laughter and bow. To decorate and do not need a keyboard. Until and after the target. But he hates shooting more than basketball. Sometimes there are no cartoon endings. No diam mauris, scelerisque or convallis convallis, who is to put it. In a bow, I don't want to spend a lot of time at the same time. Even a small amount of makeup should be applied to the hairdressing. Until then, neither the mass nor the arc of the vehicle. Duis vulputate before at mattis to put.\r\n\r\nPhasellus feugiat feugiat tellus, rutrum molestie ipsum tristique ac You need to shoot the trucks and the boat. Morbi nibh mi, jaculis eu fringilla consequat, consequat en risus. Some people who advertise on the internet need to post hate cartoons. Until it was a smile. But that course of pain, let it be a lot of warmth. We live a sad life. The children's portal before the earth dignissim trucks rhoncus not lorem. It was a weekend. There is nothing easy. There is no element of the law, there is no football. The price of life is not the price of football. There is no venomous sem vitae dolor laoreet, but scelerisque mauris aculis.\r\n\r\nThe smile of Mauris pulvinar does not match the porter's vestibule. Some vehicles were afraid of the eros, but it was the chocolate of Lacinia. There is no makeup for the chocolate sauce. The customer is very important, the customer will be followed by the customer. It should be a lot of fun and I'm looking for vehicles in the lake. I don't have a good chat, but it's sad. Until the end it was always an element. Not even a large valley, but sometimes a region, except for basketball. Until the football vehicles are clear. Sometimes there is no trigger for grief, the story of life needs hatred."
                    });
                }
                db_context.Articles.AddRange(articles);

                db_context.SaveChanges();
                List<User_account> user_accounts = new() { new User_account
                {
                    Login = "Dublongold",
                    Password = "123",
                    Name = "Dublon", Surname = "Gold",
                    Email = "dublon123gold@gmail.com",
                    About = "Programeer on C# Asp.Net Core MVC. Level: Trainee/Junior",
                    Photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACHklEQVR42tVYXVLCMBBuxhMEZUAFKe2AOs74gkfAI+AR4AhwBDiCPUI9Aj0CPviCI0qL/ygCvvrgVM1mH9LhJwUH0n35SOjufu0m2d0Q3/c1GdnbT7AHHzvvWhhJ5yjDh86IyDxPIkNo19DZHy/ePRsbYFerVgHLpdmGrQvARgPQHQPuZDMMn90eiSahZDbOJt56H2xsn8N8qSgXIu5Xo4H5CwfwrAKY0LcY9r0BiQah9JHBfjy1PTbuNuEBw5Aj4lwC1mqAzeZkYq4LaJ4Cpswsw8c7l6hNiBDiLxSiseighS9CZ+sFQ/jLQ1FCuwb1YRuCZUpFR93WZAcNS0QaWNTz9FHME8Av7lg9Qn9fCz41aFKu6TgOP9gqwiLH0KDgC5zX5fTnhU5dQk2+TwuFAncEhk3T5AbdycnQxG2+mH7QjrqEUIpF2O+2bQsGR63xTEOL6kePUFAwdUxblLETcZuH1Y8OIb+rrVXUJxQ2qU4rzLB0dTiiXUpDHozKEMrkNxmhjcFQSIayBNAQzxRanTcB1bKcHUyu3/FNRQnJFmhYolYqIiFsh5CIrCxdMa6cUMpIQ6HmPQkOLEs84Mrl5RZ/sMhP6tA4vno9xQlNaxRxcWILTRc8+IIh0g8TDL12P1znunZCKNs6XDb078XLhnpdLmRIABtHvGzIH+cY3lx1wt1+KEcoKJk8tEsPt5+hQqUfxCA018P/vUFbFaEf2CTdNCqNGH8AAAAASUVORK5CYII=",
                    Status = new User_status(),
                    Articles = db_context.Articles.Where(art => art.Id == 1 || art.Id == 2).ToList(),
                    Articles_which_liked = db_context.Articles.Where(art => art.Id == 3).ToList(),
                    Articles_which_disliked = db_context.Articles.Where(art => art.Id == 2).ToList()
                },
                new User_account
                {
                    Login = "Bobik",
                    Password = "123",
                    Name = "Bobik", Surname = "Bobikov",
                    Email = "bobik@gmail.com",
                    About = "Я просто бобік.",
                    Status = new User_status(User_statuses.AFK),
                    Articles = db_context.Articles.Where(art => art.Id > 2).ToList(),
                    Articles_which_liked = db_context.Articles.Where(art => art.Id == 1 || art.Id == 3).ToList(),
                    Articles_which_disliked = db_context.Articles.Where(art => art.Id == 2).ToList()
                }};
                db_context.User_accounts.AddRange(user_accounts);
                db_context.SaveChanges();
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 1,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 2),
                        Content = "Good article!",
                        Users_who_disliked = db_context.User_accounts.Where(ac => ac.Id == 1).ToList()
                    }); ;
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 3,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 2),
                        Content = "Good article!",
                    }); ;
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 4,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 2),
                        Content = "Good article!",
                        Users_who_liked = db_context.User_accounts.Where(ac => ac.Id == 1).ToList()
                    });
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 1,
                        Article_id = 3,
                        Author = db_context.User_accounts.First(ac => ac.Id == 1),
                        Content = "Good article!",
                    });
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 2,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 1),
                        Content = "Thanks!",
                        Reply_level = 1,
                        Reply_to_comment_id = 1,
                        Reply_to_comment_id_of_article = 1
                    });
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 5,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 1),
                        Content = "Thanks!",
                        Reply_level = 1,
                        Reply_to_comment_id = 1,
                        Reply_to_comment_id_of_article = 1
                    });
                for (int i = 31; i < 40; i++)
                {
                    db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = i,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 1),
                        Content = "Thanks!",
                        Reply_level = 1,
                        Reply_to_comment_id = 1,
                        Reply_to_comment_id_of_article = 1
                    });
                }
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 6,
                        Article_id = 1,
                        Author_id = 2,
                        Content = "Thanks too!",
                        Reply_level = 2,
                        Reply_to_comment_id = 2,
                        Reply_to_comment_id_of_article = 1
                    });
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 7,
                        Article_id = 1,
                        Author_id = 2,
                        Content = "Thanks too!",
                        Reply_level = 2,
                        Reply_to_comment_id = 5,
                        Reply_to_comment_id_of_article = 1
                    });
                for(int i = 8; i < 30; i++)
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = i,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 2),
                        Content = "Good article!!",
                        Users_who_disliked = db_context.User_accounts.Where(ac => ac.Id == 1).ToList()
                    });
                db_context.Article_comments.Add(
                    new Article_comment()
                    {
                        Id = 30,
                        Article_id = 1,
                        Author = db_context.User_accounts.First(ac => ac.Id == 2),
                        Content = "Good article!!!",
                        Users_who_disliked = db_context.User_accounts.Where(ac => ac.Id == 1).ToList()
                    });
                db_context.SaveChanges();
            }
        }
    }
}
