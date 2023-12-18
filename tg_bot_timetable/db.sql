CREATE TABLE IF NOT EXISTS public."group"
(
    id integer NOT NULL DEFAULT nextval('group_id_seq'::regclass),
    group_name character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT group_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.lesson
(
    id integer NOT NULL DEFAULT nextval('lesson_id_seq'::regclass),
    lesson_name character varying(50) COLLATE pg_catalog."default",
    lesson_type character varying(5) COLLATE pg_catalog."default",
    CONSTRAINT lesson_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.room
(
    id integer NOT NULL DEFAULT nextval('room_id_seq'::regclass),
    room_name character varying(4) COLLATE pg_catalog."default",
    CONSTRAINT room_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.timetable
(
    id integer NOT NULL DEFAULT nextval('timetable_id_seq'::regclass),
    date date,
    "number" integer,
    group_id integer,
    room_id integer,
    lesson_id integer,
    CONSTRAINT timetable_pkey PRIMARY KEY (id),
    CONSTRAINT group_id FOREIGN KEY (group_id)
        REFERENCES public."group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT lesson_id FOREIGN KEY (lesson_id)
        REFERENCES public.lesson (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT room_id FOREIGN KEY (room_id)
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
