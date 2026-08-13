<?php
/**
 * Home page template.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$reel_url = get_theme_mod( 'il_reel_video_url' );
?>

<section class="hero hero--home">
	<div class="container hero__inner il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Food. Travel. People. Places.', 'independent-lasagna' ); ?></span>
		<h1><?php esc_html_e( 'We go looking for stories with layers.', 'independent-lasagna' ); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'Independent Lasagna Productions makes documentary films and original series about food, travel, and the people who make a place worth stopping for. Brands hire us to do the same for them.', 'independent-lasagna' ); ?></p>
		<div class="button-row">
			<a class="button button--primary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Watch Our Work', 'independent-lasagna' ); ?></a>
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container il-fade">
		<?php if ( $reel_url ) : ?>
			<?php il_video_embed( $reel_url ); ?>
		<?php else : ?>
			<div class="media-frame media-frame--reel">
				<span class="media-frame__placeholder" aria-hidden="true"></span>
			</div>
			<p class="il-admin-note"><?php esc_html_e( 'Reel coming soon — add a link under Customize → Site Identity → Homepage Reel Video URL.', 'independent-lasagna' ); ?></p>
		<?php endif; ?>
	</div>
</section>

<section class="section section--cream">
	<div class="container statement il-fade">
		<?php il_layers_mark(); ?>
		<span class="eyebrow"><?php esc_html_e( 'How We Work', 'independent-lasagna' ); ?></span>
		<h2><?php esc_html_e( 'Every story has layers. We dig through them.', 'independent-lasagna' ); ?></h2>
		<p><?php esc_html_e( 'Food gets us through the door. Travel gets us there. People give us the story. Film lets us bring it home. We aren’t just filming what people eat — we’re documenting why it matters.', 'independent-lasagna' ); ?></p>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Original Productions', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Shows we make because we can’t not make them.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$originals_query = new WP_Query(
				array(
					'post_type'      => 'il_work',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
					'tax_query'      => array(
						array(
							'taxonomy' => 'il_work_type',
							'field'    => 'slug',
							'terms'    => 'original-productions',
						),
					),
				)
			);
			if ( $originals_query->have_posts() ) :
				$i = 0;
				while ( $originals_query->have_posts() ) :
					$originals_query->the_post();
					il_work_card( get_the_ID(), $i * 70 );
					$i++;
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p class="il-admin-note"><?php esc_html_e( 'First season is in production. Add entries under Work → Add New and tag them “Original Productions.”', 'independent-lasagna' ); ?></p>
			<?php endif; ?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( add_query_arg( 'type', 'original-productions', home_url( '/work/' ) ) ); ?>"><?php esc_html_e( 'All Original Productions', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Our Specialty', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Food is the doorway. Travel gets us there.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="split">
			<article class="card il-fade">
				<span class="eyebrow"><?php esc_html_e( 'Food', 'independent-lasagna' ); ?></span>
				<h3><?php esc_html_e( 'We’d rather eat off a folding table than a $300 tasting menu.', 'independent-lasagna' ); ?></h3>
				<p><?php esc_html_e( 'A grandmother making dumplings. A pitmaster who’s been up since 5 a.m. A six-table restaurant run by a family that crossed an ocean to open it. Food is rarely just the story — it’s how we get invited into a bigger one.', 'independent-lasagna' ); ?></p>
			</article>
			<article class="card il-fade" style="animation-delay:100ms">
				<span class="eyebrow"><?php esc_html_e( 'Travel', 'independent-lasagna' ); ?></span>
				<h3><?php esc_html_e( 'We’re not chasing a top-ten list. We’re chasing a guy in a town you’ve never heard of.', 'independent-lasagna' ); ?></h3>
				<p><?php esc_html_e( 'Small towns. Neighborhood bars. Roadside attractions everyone else drives past. We go looking for the places and people that haven’t been smoothed out yet — before they are.', 'independent-lasagna' ); ?></p>
			</article>
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Client Work', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Brands who wanted the real thing.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$client_query = new WP_Query(
				array(
					'post_type'      => 'il_work',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
					'tax_query'      => array(
						array(
							'taxonomy' => 'il_work_type',
							'field'    => 'slug',
							'terms'    => 'client-work',
						),
					),
				)
			);
			if ( $client_query->have_posts() ) :
				$i = 0;
				while ( $client_query->have_posts() ) :
					$client_query->the_post();
					il_work_card( get_the_ID(), $i * 70 );
					$i++;
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p class="il-admin-note"><?php esc_html_e( 'Nothing published yet. Add entries under Work → Add New and tag them “Client Work.”', 'independent-lasagna' ); ?></p>
			<?php endif; ?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( add_query_arg( 'type', 'client-work', home_url( '/work/' ) ) ); ?>"><?php esc_html_e( 'See All Client Work', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container split">
		<div class="il-fade">
			<span class="eyebrow"><?php esc_html_e( 'For Brands', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'We also make things for people who aren’t us.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Restaurant films. Tourism campaigns. Founder documentaries. Commercials that don’t feel like commercials. If your brand has a story with any layers to it at all, we probably want to make it.', 'independent-lasagna' ); ?></p>
			<a class="link-arrow" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'See our services', 'independent-lasagna' ); ?></a>
		</div>
		<div class="il-fade" style="animation-delay:100ms">
			<span class="eyebrow"><?php esc_html_e( 'Who We Are', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Founded on the idea that good stories shouldn’t need a big budget.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Independent Lasagna Productions was started by filmmakers who’d rather find a story behind a gas station than sit in a conference room. We’re still doing that. Curious, independent, and always slightly hungry.', 'independent-lasagna' ); ?></p>
			<a class="link-arrow" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'More about us', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Slices of Lasagna', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Dispatches from the road.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$news_query = new WP_Query(
				array(
					'post_type'      => 'post',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
				)
			);
			if ( $news_query->have_posts() ) :
				$i = 0;
				while ( $news_query->have_posts() ) :
					$news_query->the_post();
					?>
					<article class="card il-fade" style="animation-delay:<?php echo esc_attr( $i * 70 ); ?>ms">
						<span class="eyebrow"><?php echo esc_html( get_the_date() ); ?></span>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18 ) ); ?></p>
					</article>
					<?php
					$i++;
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p class="il-admin-note"><?php esc_html_e( 'No posts yet — published posts will appear here automatically.', 'independent-lasagna' ); ?></p>
				<?php
			endif;
			?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/news/' ) ); ?>"><?php esc_html_e( 'Read the News', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container statement il-fade">
		<h2><?php esc_html_e( 'Got a story with layers? So do we. Let’s talk.', 'independent-lasagna' ); ?></h2>
		<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
