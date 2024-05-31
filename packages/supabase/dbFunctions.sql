create or replace function get_aggregated_downloads()
returns TABLE(identifier text, total_downloads integer)
language sql
as $$
  select ext_publish.identifier, sum(ext_publish.downloads)
    from ext_publish
    group by identifier;
$$;

-- select * from get_aggregated_downloads();
create or replace function get_aggregated_downloads_with_details()
returns TABLE(identifier text, total_downloads integer, name text, short_description text)
language sql
as $$
  select pub.identifier, sum(pub.downloads), ext.name, ext.short_description
    from ext_publish pub join extensions ext on pub.identifier = ext.identifier
    group by pub.identifier, ext.name, ext.short_description;
$$;

-- select * from get_aggregated_downloads_with_details();
CREATE OR REPLACE FUNCTION increment_downloads(t_identifier text, t_version text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  downloads_after integer;
BEGIN
  -- Increment downloads in ext_publish table
  UPDATE ext_publish
  SET downloads = downloads + 1
  WHERE identifier = t_identifier AND version = t_version;

  -- Increment downloads in extensions table
  UPDATE extensions
  SET downloads = downloads + 1
  WHERE identifier = t_identifier;

  -- Retrieve the updated downloads count from the extensions table
  SELECT downloads 
  INTO downloads_after 
  FROM extensions 
  WHERE identifier = t_identifier;

  RETURN downloads_after;
END;
$$;

select * from increment_downloads('tech.huakun.jarvis-jwt-inspector', '0.0.1');