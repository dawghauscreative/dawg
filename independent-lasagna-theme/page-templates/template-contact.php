<?php
/**
 * Template Name: Contact
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$status = isset( $_GET['il_contact'] ) ? sanitize_key( wp_unslash( $_GET['il_contact'] ) ) : '';
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Let’s Talk', 'independent-lasagna' ); ?></span>
		<h1><?php the_title(); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'Tell us about your project — a restaurant film, a tourism campaign, a documentary, a commercial, or something we haven’t thought of yet. Name your budget; we’ll tell you what’s possible.', 'independent-lasagna' ); ?></p>
	</div>
</section>

<section class="section section--cream">
	<div class="container split">

		<div class="il-fade">

			<?php if ( 'sent' === $status ) : ?>
				<div class="form-notice form-notice--success" role="status">
					<?php esc_html_e( 'Thanks — your message is in. We’ll be in touch soon.', 'independent-lasagna' ); ?>
				</div>
			<?php elseif ( 'error' === $status ) : ?>
				<div class="form-notice form-notice--error" role="alert">
					<?php esc_html_e( 'Please fill in your name, a valid email, and a message, then try again.', 'independent-lasagna' ); ?>
				</div>
			<?php endif; ?>

			<form class="contact-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="il_contact_submit">
				<?php wp_nonce_field( 'il_contact_submit', 'il_contact_nonce' ); ?>
				<input type="text" name="il_website" class="il-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

				<div class="form-row">
					<label for="il_name"><?php esc_html_e( 'Name', 'independent-lasagna' ); ?></label>
					<input type="text" id="il_name" name="il_name" required>
				</div>

				<div class="form-row form-row--split">
					<div>
						<label for="il_email"><?php esc_html_e( 'Email', 'independent-lasagna' ); ?></label>
						<input type="email" id="il_email" name="il_email" required>
					</div>
					<div>
						<label for="il_phone"><?php esc_html_e( 'Phone (optional)', 'independent-lasagna' ); ?></label>
						<input type="tel" id="il_phone" name="il_phone">
					</div>
				</div>

				<div class="form-row">
					<label for="il_service"><?php esc_html_e( 'What do you need?', 'independent-lasagna' ); ?></label>
					<select id="il_service" name="il_service">
						<option value="Food & Beverage Production"><?php esc_html_e( 'Food & Beverage Production', 'independent-lasagna' ); ?></option>
						<option value="Travel & Destination Production"><?php esc_html_e( 'Travel & Destination Production', 'independent-lasagna' ); ?></option>
						<option value="Documentary & Branded Storytelling"><?php esc_html_e( 'Documentary & Branded Storytelling', 'independent-lasagna' ); ?></option>
						<option value="Commercial Production"><?php esc_html_e( 'Commercial Production', 'independent-lasagna' ); ?></option>
						<option value="Original Programming / Partnership"><?php esc_html_e( 'Original Programming / Partnership', 'independent-lasagna' ); ?></option>
						<option value="Other"><?php esc_html_e( 'Something Else', 'independent-lasagna' ); ?></option>
					</select>
				</div>

				<div class="form-row">
					<label for="il_message"><?php esc_html_e( 'Tell us about it', 'independent-lasagna' ); ?></label>
					<textarea id="il_message" name="il_message" rows="5" required></textarea>
				</div>

				<button type="submit" class="button button--dark"><?php esc_html_e( 'Send It', 'independent-lasagna' ); ?></button>
			</form>
		</div>

		<div class="il-fade" style="animation-delay:100ms">
			<div class="card">
				<span class="eyebrow"><?php esc_html_e( 'Direct Lines', 'independent-lasagna' ); ?></span>
				<h3><?php esc_html_e( 'General Inquiries', 'independent-lasagna' ); ?></h3>
				<p><a href="mailto:info@independentlasagna.com">info@independentlasagna.com</a></p>
				<h3><?php esc_html_e( 'Follow Along', 'independent-lasagna' ); ?></h3>
				<?php il_social_links(); ?>
			</div>
		</div>

	</div>
</section>

<?php if ( get_the_content() ) : ?>
<section class="section section--dark">
	<div class="container il-fade page-content">
		<?php the_content(); ?>
	</div>
</section>
<?php endif; ?>

<?php get_footer(); ?>
