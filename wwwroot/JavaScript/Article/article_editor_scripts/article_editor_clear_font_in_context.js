function article_editor_clear_font_in_context(event)
{
    let article_content = document.getElementById("article_content");
    article_content.innerHTML = article_content.innerHTML.replace(/style=["'].*?["']/g, "");
}