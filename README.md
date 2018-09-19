# AWS Basics
We are going deploy a simple S3 proxy and a static website, t
At the end of the primer, we will have some basic AWS literacy.

## Primer Goals

1. Can use the AWS CLI to access AWS services (primarily S3)
2. Can deploy a static website to S3
3. Understand at a high level what IAM is and how roles and permissions work and why they are important
4. Launch an EC2 instance that they can log in to using SSH
5. Can log in to the instance to modify some file that they can see the result of in the static site


## Steps

#### 0. Set up AWS credentials and AWS command line
a. Install AWS CLI:
`pip install --user awscli`

b. Obtain AWS IAM credentials with permissions to read and write to S3, and launch new EC2 instances
c. Generate and install access keys to `~/.aws/credentials` using `aws config` 
d. Setup SSH: Obtain a SSH key `aws-primer.pem`. Move the key to `~/.ssh/aws-primer.pem`. Run this command to restrict access to this key: `chmod 600 ~/.ssh/aws-primer.pem`. Add this key to your SSH authentication agent: `ssh-add ~/.ssh/aws-primer.pem`


#### 1. Deploy EC2 instance through EC2 wizard to set up a new server

##### Wizard walkthrough
1. AMI
2. Instance types
3. Configure instance 
	- Availability zones
	- VPC/subnet
	- IAM roles
	- Public IP
		- Elastic IPs
	- Tenancy
4. Add Storage
5. Add Tags
6. Configure Security Groups
	- Set up SSH access limited to origin network: port 22 from current network
	- Set up HTTP access for public access: port 3000 from 0.0.0.0

e. Launch. Wait ~5 minutes for the service to be utilized and server logs to be available through the web interface.  When the system logs are available open them up to fetch the SSH fingerprint.

f. Log in to the server and poke around.

	ssh ec2-user@<MY_EC2_DNS>

Install Node and set up the API project

	# Update the yum repo
	sudo yum update

	# Configure node repos
	curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -

	# Install node and git
	sudo yum install -y nodejs git
	
	git clone https://github.com/codeslikejaggars/aws-primer.git

	cd ./aws-primer

	npm install
	npm dev


#### 2. Deploy a static website to S3
Replace `<MY_EC2_DNS>` in `./index.html` with the EC2 instance's DNS hostname.

Then, deploy to S3:

	# Create the bucket (S3 Bucket names must be globally unique for a given region)
	aws s3 mb s3://aws-primer-20180914

	# Upload index file to bucket and make it publicly accessible
	aws s3 cp ./index.html s3://aws-primer-20180914 --acl public-read

	# Upload the data file (dont make it public)
	aws s3 cp ./data.json s3://aws-primer-20180914

	# Configure the bucket as a website
	aws s3 website s3://my-bucket-name --index-file index.html

	# Fetch the file to ensure it works
	curl http://aws-primer-20180914.s3-website-us-west-2.amazonaws.com/index.html


#### 3. Test
