# reviews/utils.py
import copy


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
