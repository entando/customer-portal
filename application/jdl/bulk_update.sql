-- Select all users
select * from portal_user;

-- Select all projects for a named customer
select c.name, c.id, p.* from project p
join customer c on c.id = p.customer_id
where c.name = 'Customer 2';

-- Select a user by email address with project/customer associations
select c.name, c.id, p.name, u.email, pu.* from project_user pu
left join portal_user u on pu.user_id = u.id
left join project p on p.id = pu.project_id
left join customer c on c.id = p.customer_id
where u.email = 'user+2@test.com';
-- and c.name = 'A TEST1 Customer';

-- Remove a user from all projects for a given customer
delete from project_user pu using portal_user u
where pu.user_id = u.id
	and u.email = 'user+2@test.com'
	and pu.project_id in (
	   select p.id from project p
  	   join customer c on c.id = p.customer_id
--       where c.name = 'Customer 2'
       where c.name = '_Test_Org'
    );
   
-- Assign a user to all projects for a given customer
  insert into project_user
  (
    select u.id, p.id from portal_user u, project p
  	   join customer c on c.id = p.customer_id
--       where c.name = 'Customer 2' 
       where c.name = '_Test_Org' 
       and u.email = 'user+2@test.com'
  );
   
   
   



