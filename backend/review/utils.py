# reviews/utils.py
import random
import copy


def pop_reviews_from_project_list(serializer_data):
    clean_copy = copy.deepcopy(serializer_data)
    for i in clean_copy:
        i['reviews'] = []

    return clean_copy

def pop_reviews_from_project(serializer_data):
    clean_copy = copy.deepcopy(serializer_data)
    clean_copy['reviews'] = []
    return clean_copy


def filter_by_user(review, user_id):
    for i in review.get('collaborators'):
        if i.get('id') == user_id:
            return True
    return False


def filter_project_reviews_by_collaborator(serializer_data, user_id):
    """ This will filter project reviews by given collaborator id """

    clean_copy = copy.deepcopy(serializer_data)
    result = filter(lambda x: filter_by_user(
        x, user_id), clean_copy.get('reviews'))

    clean_copy['reviews'] = list(result)
    return clean_copy


def filter_project_reviews_by_created_user(serializer_data, user_id):
    """ This will filter project reviews by created user with given id """

    clean_copy = copy.deepcopy(serializer_data)
    result = filter(lambda x: x.user.id == user_id, clean_copy.get('reviews'))

    clean_copy['reviews'] = list(result)
    return clean_copy


def filter_project_reviews_by_review_name(serializer_data, review_name):
    """ This will filter project reviews by given review name """

    clean_copy = copy.deepcopy(serializer_data)
    result = filter(lambda x: True if review_name.lower() in x.get(
        'review_name').lower() else False, clean_copy.get('reviews'))

    clean_copy['reviews'] = list(result)
    return clean_copy


# https://stackoverflow.com/questions/13998901
# /generating-a-random-hex-color-in-python
def random_hex_color_code():
    def r(): return random.randint(0, 255)
    return ('#%02X%02X%02X' % (r(), r(), r()))
