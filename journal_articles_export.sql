SELECT COALESCE(
    jsonb_agg(
        to_jsonb(a)
        ORDER BY a.published_at NULLS LAST, a.slug
    ),
    '[]'::jsonb
) AS articles
FROM (
    SELECT
        id,
        slug,
        title,
        subtitle,
        excerpt,
        body,
        cover_image,
        category_id,
        format,
        reading_minutes,
        status,
        featured,
        published_at,
        updated_at,
        views
    FROM public.journal_articles
) AS a;