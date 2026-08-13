<?php
/**
 * Template Name: Services
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$services = array(
	array(
		'name'  => __( 'Video Production', 'independent-lasagna' ),
		'body'  => __( 'Commercials, brand films, and event coverage — shot, edited, and color graded in-house. We build viral-esque content designed to actually get watched and shared, not just posted.', 'independent-lasagna' ),
		'items' => array( 'Small Business Commercials', 'Video Editing', 'Color Grading & Correction', 'Video Cleanup & Restoration' ),
	),
	array(
		'name'  => __( 'Web Design & Management', 'independent-lasagna' ),
		'body'  => __( 'A stylish, personalized website for business or pleasure. We’ll build it, host it, manage it — or teach you how to run it yourself.', 'independent-lasagna' ),
		'items' => array( 'Custom site design', 'Hosting & maintenance', 'Hands-on training' ),
	),
	array(
		'name'  => __( 'Social Content & Management', 'independent-lasagna' ),
		'body'  => __( 'Trouble coming up with fun, clickable content for your platforms? We handle the memes, videos, graphics, and contests so your feed never goes quiet.', 'independent-lasagna' ),
		'items' => array( 'Content creation', 'Channel management', 'Campaigns & contests' ),
	),
	array(
		'name'  => __( 'Graphic Design', 'independent-lasagna' ),
		'body'  => __( 'Brand identity, print, and digital design built to hold its own next to the big budgets — logos, posters, packaging, and everything in between.', 'independent-lasagna' ),
		'items' => array( 'Brand identity', 'Print & packaging', 'Digital assets' ),
	),
	array(
		'name'  => __( 'Sound Design & Original Music', 'independent-lasagna' ),
		'body'  => __( 'Original composition and sound design built for your picture, not pulled from a stock library — because the right score changes everything.', 'independent-lasagna' ),
		'items' => array( 'Original scoring', 'Sound design & mix', 'Audio cleanup' ),
	),
);
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'What We Do', 'independent-lasagna' ); ?></span>
		<h1><?php the_title(); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'Small businesses can’t afford the high prices of normal production services — so we make high-quality content financially feasible, for our clients and ourselves.', 'independent-lasagna' ); ?></p>
		<div class="button-row">
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request a Free Consultation', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<?php if ( get_the_content() ) : ?>
<section class="section section--cream">
	<div class="container il-fade page-content">
		<?php the_content(); ?>
	</div>
</section>
<?php endif; ?>

<section class="section section--dark">
	<div class="container">
		<div class="services-list">
			<?php foreach ( $services as $i => $service ) : ?>
				<article class="service-row il-fade" style="animation-delay:<?php echo esc_attr( $i * 60 ); ?>ms">
					<h2><?php echo esc_html( $service['name'] ); ?></h2>
					<div class="service-row__body">
						<p><?php echo esc_html( $service['body'] ); ?></p>
						<ul class="service-row__items">
							<?php foreach ( $service['items'] as $item ) : ?>
								<li><?php echo esc_html( $item ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container split">
		<div class="il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Also Available', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Wedding Films', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Documentary-style wedding coverage — every package built around your day, your budget, and your story. From ceremony coverage to full-length wedding documentaries.', 'independent-lasagna' ); ?></p>
			<a class="button button--dark" href="mailto:weddings@independentlasagna.com"><?php esc_html_e( 'Email the Wedding Team', 'independent-lasagna' ); ?></a>
		</div>
		<div class="media-frame il-fade" style="animation-delay:100ms">
			<span class="media-frame__placeholder" aria-hidden="true"></span>
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container statement il-fade">
		<h2><?php esc_html_e( 'Name your budget. Let’s talk about your project.', 'independent-lasagna' ); ?></h2>
		<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Get In Touch', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
