<?php
/**
 * Template Name: Work
 * Filterable portfolio of the il_work custom post type.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$active_type = isset( $_GET['type'] ) ? sanitize_title( wp_unslash( $_GET['type'] ) ) : '';
$terms       = get_terms( array( 'taxonomy' => 'il_work_type', 'hide_empty' => false ) );
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Our Work', 'independent-lasagna' ); ?></span>
		<h1><?php the_title(); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'Original productions and client films — a running record of the stories we’ve gone looking for, on our own dime and someone else’s.', 'independent-lasagna' ); ?></p>
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

		<?php if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) : ?>
			<div class="filter-row il-fade">
				<a href="<?php echo esc_url( remove_query_arg( 'type' ) ); ?>" class="filter-pill<?php echo ( '' === $active_type ) ? ' is-active' : ''; ?>"><?php esc_html_e( 'All', 'independent-lasagna' ); ?></a>
				<?php foreach ( $terms as $term ) : ?>
					<a href="<?php echo esc_url( add_query_arg( 'type', $term->slug ) ); ?>" class="filter-pill<?php echo ( $active_type === $term->slug ) ? ' is-active' : ''; ?>"><?php echo esc_html( $term->name ); ?></a>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php
		$args = array(
			'post_type'      => 'il_work',
			'posts_per_page' => -1,
		);
		if ( $active_type ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'il_work_type',
					'field'    => 'slug',
					'terms'    => $active_type,
				),
			);
		}
		$work_query = new WP_Query( $args );
		?>

		<?php if ( $work_query->have_posts() ) : ?>
			<div class="grid grid--3">
				<?php
				$i = 0;
				while ( $work_query->have_posts() ) :
					$work_query->the_post();
					il_work_card( get_the_ID(), $i * 60 );
					$i++;
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		<?php else : ?>
			<div class="empty-state il-fade">
				<p><?php esc_html_e( 'Nothing published in this category yet. Add entries under Work → Add New in wp-admin — each one gets a poster, logline, trailer link, and an optional "watch now" URL.', 'independent-lasagna' ); ?></p>
			</div>
		<?php endif; ?>

	</div>
</section>

<?php get_footer(); ?>
