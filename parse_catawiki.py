from bs4 import BeautifulSoup
import json
import os

def parse_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    data = {}

    # Seller Name
    h1 = soup.find('h1')
    data['name'] = h1.get_text(strip=True) if h1 else None

    # Location
    location_tag = soup.find('span', class_=lambda x: x and 'SellerLocation_country' in x)
    data['location'] = location_tag.get_text(strip=True) if location_tag else None

    # Stats
    # Objects sold
    objects_sold_div = soup.find('div', attrs={"data-sentry-component": "ObjectsSoldCell"})
    if objects_sold_div:
         num_div = objects_sold_div.find('div', class_=lambda x: x and 'u-typography-body-s' in x)
         data['objects_sold'] = num_div.get_text(strip=True) if num_div else None

    # Reviews count
    reviews_div = soup.find('div', attrs={"data-sentry-component": "ReviewsCell"})
    if reviews_div:
        count_div = reviews_div.find('div', class_=lambda x: x and 'u-typography-body-s' in x)
        data['reviews_count'] = count_div.get_text(strip=True) if count_div else None

    # Score
    score_div = soup.find('div', attrs={"data-sentry-component": "ScoreCell"})
    if score_div:
         score_span = score_div.find('span')
         data['score'] = score_span.get_text(strip=True) if score_span else None

    # Story
    story_div = soup.find('div', class_=lambda x: x and 'SellerStory_story' in x)
    data['story'] = story_div.get_text(separator="\n", strip=True) if story_div else None

    # Reviews List
    reviews = []
    review_list = soup.find('ul', class_=lambda x: x and 'FeedbackCommentList_review-list' in x)
    if review_list:
        items = review_list.find_all('li')
        for item in items:
            review = {}
            article = item.find('article')
            if not article:
                continue
            
            author_div = article.find('div', attrs={"data-testid": "feedback-comment-author"})
            review['author'] = author_div.get_text(strip=True) if author_div else None

            type_div = article.find('div', attrs={"data-testid": "feedback-comment-type"})
            review['type'] = type_div.get('title') if type_div else None
            if not review['type'] and type_div:
                 review['type'] = type_div.get_text(strip=True)

            date_div = None
            if type_div:
                parent = type_div.parent
                siblings = parent.find_all('div', recursive=False)
                for sib in siblings:
                    if sib != type_div and sib.has_attr('title'):
                        review['date_iso'] = sib['title']
                        review['date_text'] = sib.get_text(strip=True).replace('•', '').strip()
                        break
            
            body_p = article.find('p', attrs={"data-testid": "feedback-comment-body"})
            review['body'] = body_p.get_text(strip=True) if body_p else None

            reviews.append(review)

    data['reviews'] = reviews
    return data

if __name__ == "__main__":
    result = parse_html('temp_catawiki.html')
    print(json.dumps(result, indent=2, ensure_ascii=False))
