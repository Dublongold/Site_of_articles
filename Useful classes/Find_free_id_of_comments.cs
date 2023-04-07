using Dublongold_site.Models;

namespace Dublongold_site.Useful_classes
{
    /// <summary>
    /// Клас, який тримає в собі метод для пошуку вільного айді по цілочисельному списку.
    /// </summary>
    public static class Find_free_id_of_comments
    {
        public static List<int> Free_id_list { get; set; } = new();
        /// <summary>
        /// Виконує пошук вільного айді у списку, який передається в якості параметру методу.
        /// </summary>
        /// <param name="list_of_id">Список, по якому буде шукатися вільний айді. Це повинен бути список елементів(статті, коментарі, облікові записи користувачів тощо), котрий перетворений в список цілочисельних елементів, які представляють айді.</param>
        /// <returns>Повертає вільний айді(<see cref="int"/>). Якщо в списку опиняться всі айді зайняті(від 1 до N), то просто повертає число, яке предсталяє наступний айді.</returns>
        public static int Get_free_id(List<int> list_of_id)
        {
            int i;
            if (Free_id_list.Count > 0)
            {
                Free_id_list = Free_id_list.Order().ToList();
                int result_id = Free_id_list.First();
                Free_id_list.Remove(Free_id_list.First());
                return result_id;
            }
            for(i = 1; i <= list_of_id.Count; i++)
            {
                if (list_of_id[i - 1] == i)
                {
                    continue;
                }
                break;
            }
            return i;
        }
    }
}
