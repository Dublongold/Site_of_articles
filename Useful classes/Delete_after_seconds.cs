namespace Dublongold_site.Useful_classes
{
    public static class Delete_after_seconds
    {
        public static async void Delete_file_after_seconds(string file_path, float seconds)
        {
            await Task.Delay((int)(seconds * 1000));
            File.Delete(file_path);
        }
        public static async void Delete_directory_after_seconds(string directory_path, float seconds, bool recursive = true)
        {
            await Task.Delay((int)(seconds * 1000));
            Directory.Delete(directory_path, recursive);
        }
    }
}
