using Microsoft.AspNetCore.Razor.TagHelpers;
using Dublongold_site.Models;
using System.Text.RegularExpressions;

namespace Dublongold_site.Tag_helpers
{
    public class Artielsfafa2wfghearhwrh:TagHelper
    {
        public Article? Article { get; set; }
        public override void Process(TagHelperContext context, TagHelperOutput output) 
        {
            if (context.TagName == "render_article")
            {/*
                output.TagName = "div";
                output.TagMode = TagMode.StartTagAndEndTag;
                if (Article is not null)
                {
                    System.Text.StringBuilder builder = new();
                    builder.Append($"<h4 style='font:normal'>{Article.Theme}</h4>");
                    builder.Append($"<p>");
                    if (Article.Title_image_path != "")
                    {
                        builder.Append($"<img src='{Article.Title_image_path}' style='text-align: center;' width='100px' height = '100px'/>");
                    }
                    string article_content = Article.Content;
                    
                    Regex regex = new("<image\\d\\d?>");
                    MatchCollection matches = regex.Matches(article_content);
                    foreach (Match match in matches)
                    {
                        string string_of_image = match.Value;
                        int index_of_image = match.Index;
                        if (string_of_image.Length < 9)
                        {
                            article_content = article_content.Replace(string_of_image, $"<img src = '/Images/{Article.Image_paths[index_of_image]}'>");
                        }
                    }

                    Regex anchor_regex = new("<anchor link ?= ?'.+'>");
                    MatchCollection anchor_matches = anchor_regex.Matches(article_content);
                    foreach (Match match in anchor_matches)
                    {
                        string string_of_image = match.Value;
                        int index_of_image = match.Index;
                        if (string_of_image.Length < 9)
                        {
                            //article_content = article_content.Replace(string_of_image, $"<a href = '/{}'>");
                        }
                    }
                    builder.Append(article_content);
                }
                else
                {
                    output.Content.SetHtmlContent("<em>Sorry, but this article is empty.</em>");
                }*/
            }
        }
    }
}
