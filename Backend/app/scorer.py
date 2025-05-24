from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
from sentence_transformers import SentenceTransformer, util
import numpy as np
from app.utils import normalize_experience

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def fuzzy_match_labels(source_labels, target_labels, threshold=80):
    matched = []
    unmatched = []
    for label in target_labels:
        best_match, score = process.extractOne(label, source_labels)
        if score >= threshold:
            matched.append(best_match)
        else:
            unmatched.append(label)
    return matched, unmatched

def get_label_weights(labels, priority_labels=None, jd_labels=None):
    weights = {}
    jd_exp = 0.0

    # Find required experience from JD
    if jd_labels:
        for label in jd_labels:
            exp = normalize_experience(label)
            if exp > 0:
                jd_exp = exp
                break  # Assume only one experience label in JD for simplicity

    for label in labels:
        exp_value = normalize_experience(label)
        if exp_value > 0 and jd_exp > 0:
            # Relative to JD: cap at 1.0
            weights[label] = min(exp_value / jd_exp, 1.0)
        elif priority_labels and label in priority_labels:
            weights[label] = 2.0
        else:
            weights[label] = 1.0
    return weights

def compute_weighted_similarity(jd_labels, candidate_labels, priority_labels=None, use_semantic=False):
    jd_normalized = [label.lower() for label in jd_labels]
    candidate_normalized = [label.lower() for label in candidate_labels]

    matched_labels, unmatched_labels = fuzzy_match_labels(jd_normalized, candidate_normalized)
    all_labels = list(set(jd_normalized + candidate_normalized))
    weights = get_label_weights(all_labels, priority_labels, jd_normalized)

    jd_vec = [weights[label] if label in jd_normalized else 0.0 for label in all_labels]
    cand_vec = [weights[label] if label in matched_labels else 0.0 for label in all_labels]

    jd_vec = np.array(jd_vec).reshape(1, -1)
    cand_vec = np.array(cand_vec).reshape(1, -1)

    cosine_score = cosine_similarity(jd_vec, cand_vec)[0][0]

    if use_semantic:
        jd_embed = embedding_model.encode(" ".join(jd_labels), convert_to_tensor=True)
        cand_embed = embedding_model.encode(" ".join(candidate_labels), convert_to_tensor=True)
        semantic_score = float(util.pytorch_cos_sim(jd_embed, cand_embed)[0][0])
        cosine_score = (cosine_score + semantic_score) / 2

    # we can show 'unmatched_labels' --> like extra skills...
    return round(cosine_score, 3), matched_labels, list(set(jd_normalized) - set(matched_labels))
