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
		'name'  => __( 'Food & Beverage Production', 'independent-lasagna' ),
		'body'  => __( 'Restaurant films, chef profiles, and product launches shot the way we’d actually want to watch them — closer to a food documentary than a menu ad.', 'independent-lasagna' ),
		'items' => array( 'Restaurant Films', 'Chef Profiles', 'Product Launches', 'Recipe & Cooking Content' ),
	),
	array(
		'name'  => __( 'Travel & Destination Production', 'independent-lasagna' ),
		'body'  => __( 'Tourism campaigns and destination films built around the actual place, not a stock-footage version of it. Made for boards, hotels, and regions that want to feel like somewhere.', 'independent-lasagna' ),
		'items' => array( 'Destination Films', 'Tourism Campaigns', 'Hotel & Resort Storytelling', 'Regional Campaigns' ),
	),
	array(
		'name'  => __( 'Documentary & Branded Storytelling', 'independent-lasagna' ),
		'body'  => __( 'Founder stories, company histories, and human-interest films for brands with something real to say — told at documentary length, not thirty-second-ad length.', 'independent-lasagna' ),
		'items' => array( 'Founder Stories', 'Company Documentaries', 'Customer Stories', 'Docuseries' ),
	),
	array(
		'name'  => __( 'Commercial Production', 'independent-lasagna' ),
		'body'  => __( 'Straightforward, well-made commercials and digital campaigns — for when the assignment really is an ad, and the ad should just be good.', 'independent-lasagna' ),
		'items' => array( 'Broadcast Commercials', 'Digital Advertising', 'Social Video', 'Branded Entertainment' ),
	),
	array(
		'name'  => __( 'Original Programming', 'independent-lasagna' ),
		'body'  => __( 'Series and documentary development for networks, streamers, and digital publishers looking for a production partner who already knows how to find the story.', 'independent-lasagna' ),
		'items' => array( 'Series Development', 'Documentary Development', 'YouTube Programming', 'Pilot Production' ),
	),
);
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'What We Do', 'independent-lasagna' ); ?></span>
		<h1><?php the_title(); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'We make films for two audiences: the people who watch our own shows, and the brands who hire us to make theirs. Both sides run on the same instinct — go find the real story.', 'independent-lasagna' ); ?></p>
		<div class="button-row">
			<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
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
			<span class="eyebrow"><?php esc_html_e( 'Also Ours', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'We make our own stuff too.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Original documentaries and series, produced independently, for the same reason we got into this — because the story was too good to leave alone. Client work funds it. Curiosity drives it.', 'independent-lasagna' ); ?></p>
			<a class="button button--dark" href="<?php echo esc_url( add_query_arg( 'type', 'original-productions', home_url( '/work/' ) ) ); ?>"><?php esc_html_e( 'Watch Our Originals', 'independent-lasagna' ); ?></a>
		</div>
		<div class="media-frame il-fade" style="animation-delay:100ms">
			<span class="media-frame__placeholder" aria-hidden="true"></span>
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container statement il-fade">
		<h2><?php esc_html_e( 'Tell us the story. We’ll figure out the budget.', 'independent-lasagna' ); ?></h2>
		<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Get In Touch', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
